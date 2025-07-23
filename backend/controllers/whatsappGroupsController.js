const pool = require('../config/database');
const { sendVerificationEmail } = require('../utils/emailService');
const crypto = require('crypto');

// Get all universities with their WhatsApp groups
const getUniversities = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, short_name, email_domain, location
      FROM universities 
      ORDER BY name ASC
    `);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching universities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch universities'
    });
  }
};

// Get WhatsApp groups for a specific university
const getUniversityGroups = async (req, res) => {
  try {
    const { universityId } = req.params;

    const result = await pool.query(`
      SELECT 
        wg.id, wg.university_id, wg.group_name, wg.group_type, 
        wg.whatsapp_link, wg.intake_year, wg.intake_semester, 
        wg.description, wg.is_active, wg.member_count
      FROM whatsapp_groups wg
      WHERE wg.university_id = $1 AND wg.is_active = true
      ORDER BY 
        CASE wg.group_type 
          WHEN 'main' THEN 1 
          WHEN 'intake' THEN 2 
          WHEN 'academic' THEN 3 
          WHEN 'international' THEN 4 
          WHEN 'housing' THEN 5 
          ELSE 6 
        END,
        wg.intake_year DESC,
        wg.intake_semester DESC,
        wg.group_name ASC
    `, [universityId]);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching university groups:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch university groups'
    });
  }
};

// Start verification process
const startVerification = async (req, res) => {
  try {
    const { universityId, email, phoneNumber } = req.body;

    // Validate required fields
    if (!universityId || !email || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'University ID, email, and phone number are required'
      });
    }

    // Check if university exists
    const universityResult = await pool.query(
      'SELECT * FROM universities WHERE id = $1',
      [universityId]
    );

    if (universityResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'University not found'
      });
    }

    const university = universityResult.rows[0];

    // Validate university email domain
    if (!email.includes(university.email_domain)) {
      return res.status(400).json({
        success: false,
        message: `Email must be from ${university.email_domain} domain`
      });
    }

    // Check if email is already verified for this university
    const existingVerification = await pool.query(
      'SELECT * FROM whatsapp_verifications WHERE email = $1 AND university_id = $2 AND status = $3',
      [email, universityId, 'verified']
    );

    if (existingVerification.rows.length > 0) {
      const verifiedRecord = existingVerification.rows[0];
      
      // Check if phone number matches the one used during verification
      if (verifiedRecord.phone_number === phoneNumber) {
        // Phone number matches - allow direct access
        return res.json({
          success: true,
          alreadyVerified: true,
          message: 'Email already verified! Redirecting to WhatsApp groups.',
          data: {
            university: university.name,
            universityShortName: university.short_name,
            universityId: university.id,
            verifiedAt: verifiedRecord.verified_at
          }
        });
      } else {
        // Phone number doesn't match - security error
        return res.status(403).json({
          success: false,
          message: 'This email is already verified with a different phone number. Please use the same phone number you used during verification, or contact support if you need to update your phone number.'
        });
      }
    }

    // Check if phone number is already used
    const phoneExists = await pool.query(
      'SELECT * FROM whatsapp_verifications WHERE phone_number = $1 AND status = $2',
      [phoneNumber, 'verified']
    );

    if (phoneExists.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'This phone number is already registered'
      });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Delete any existing pending verification for this email/university
    await pool.query(
      'DELETE FROM whatsapp_verifications WHERE email = $1 AND university_id = $2 AND status = $3',
      [email, universityId, 'pending']
    );

    // Create new verification record
    const insertResult = await pool.query(`
      INSERT INTO whatsapp_verifications (university_id, email, phone_number, verification_token, expires_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, [universityId, email, phoneNumber, verificationToken, expiresAt]);

    // Send verification email
    await sendVerificationEmail({
      email,
      university: university.name,
      verificationToken,
      universityShortName: university.short_name
    });

    res.json({
      success: true,
      message: 'Verification email sent successfully',
      data: {
        verificationId: insertResult.rows[0].id,
        expiresAt: expiresAt.toISOString()
      }
    });

  } catch (error) {
    console.error('Error starting verification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start verification process'
    });
  }
};

// Confirm email verification
const confirmVerification = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    // Find verification record
    const verificationResult = await pool.query(`
      SELECT wv.*, u.name as university_name, u.short_name
      FROM whatsapp_verifications wv
      JOIN universities u ON wv.university_id = u.id
      WHERE wv.verification_token = $1
    `, [token]);

    if (verificationResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Invalid verification token'
      });
    }

    const verification = verificationResult.rows[0];

    // Check if already verified
    if (verification.status === 'verified') {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
        data: {
          university: verification.university_name
        }
      });
    }

    // Check if expired
    if (new Date() > new Date(verification.expires_at)) {
      await pool.query(
        'UPDATE whatsapp_verifications SET status = $1 WHERE id = $2',
        ['expired', verification.id]
      );
      
      return res.status(410).json({
        success: false,
        message: 'Verification token has expired'
      });
    }

    // Mark as verified
    await pool.query(
      'UPDATE whatsapp_verifications SET status = $1, verified_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['verified', verification.id]
    );

    res.json({
      success: true,
      message: 'Email verified successfully! You can now access WhatsApp groups.',
      data: {
        university: verification.university_name,
        universityShortName: verification.short_name,
        universityId: verification.university_id
      }
    });

  } catch (error) {
    console.error('Error confirming verification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm verification'
    });
  }
};

// Get verification status
const getVerificationStatus = async (req, res) => {
  try {
    const { email, universityId } = req.body;

    if (!email || !universityId) {
      return res.status(400).json({
        success: false,
        message: 'Email and university ID are required'
      });
    }

    const result = await pool.query(`
      SELECT wv.*, u.name as university_name
      FROM whatsapp_verifications wv
      JOIN universities u ON wv.university_id = u.id
      WHERE wv.email = $1 AND wv.university_id = $2
      ORDER BY wv.created_at DESC
      LIMIT 1
    `, [email, universityId]);

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: {
          status: 'not_started'
        }
      });
    }

    const verification = result.rows[0];

    res.json({
      success: true,
      data: {
        status: verification.status,
        university: verification.university_name,
        createdAt: verification.created_at,
        verifiedAt: verification.verified_at,
        expiresAt: verification.expires_at,
        universityId: verification.status === 'verified' ? verification.university_id : null
      }
    });

  } catch (error) {
    console.error('Error getting verification status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get verification status'
    });
  }
};

// Resend verification email
const resendVerification = async (req, res) => {
  try {
    const { email, universityId } = req.body;

    if (!email || !universityId) {
      return res.status(400).json({
        success: false,
        message: 'Email and university ID are required'
      });
    }

    // Find existing pending verification
    const verificationResult = await pool.query(`
      SELECT wv.*, u.name as university_name, u.short_name
      FROM whatsapp_verifications wv
      JOIN universities u ON wv.university_id = u.id
      WHERE wv.email = $1 AND wv.university_id = $2 AND wv.status = $3
    `, [email, universityId, 'pending']);

    if (verificationResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No pending verification found for this email'
      });
    }

    const verification = verificationResult.rows[0];

    // Check if not expired yet (don't resend if still valid and recent)
    const now = new Date();
    const createdAt = new Date(verification.created_at);
    const timeDiff = (now - createdAt) / (1000 * 60); // minutes

    if (timeDiff < 2) { // Prevent spam - only allow resend after 2 minutes
      return res.status(429).json({
        success: false,
        message: 'Please wait at least 2 minutes before requesting another email'
      });
    }

    // Generate new token and extend expiry
    const newToken = crypto.randomBytes(32).toString('hex');
    const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await pool.query(
      'UPDATE whatsapp_verifications SET verification_token = $1, expires_at = $2 WHERE id = $3',
      [newToken, newExpiresAt, verification.id]
    );

    // Send new verification email
    await sendVerificationEmail({
      email,
      university: verification.university_name,
      verificationToken: newToken,
      universityShortName: verification.short_name
    });

    res.json({
      success: true,
      message: 'Verification email resent successfully'
    });

  } catch (error) {
    console.error('Error resending verification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification email'
    });
  }
};

module.exports = {
  getUniversities,
  getUniversityGroups,
  startVerification,
  confirmVerification,
  getVerificationStatus,
  resendVerification
}; 