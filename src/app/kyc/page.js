'use client';
import { useState, useEffect } from 'react';
import {
  FiCheckCircle, FiX, FiUpload, FiLock,
  FiUser, FiMail, FiPhone, FiLoader, FiInfo
} from 'react-icons/fi';
import { useSnackbar } from '@/hooks/useSnackbar';
import Snackbar from '@/components/layout/Snackbar';
import { addBankDetails, addPanCard, addGST, uploadImage } from '@/services/authSignupService';
import { useAuth } from '@/context/AuthContext';

export default function KYCPage() {
  const { user } = useAuth();
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const [loading, setLoading] = useState({
    pan: false,
    gst: false,
    bank: false,
    submit: false
  });

  // Initialize with user data if available
  const [kycData, setKycData] = useState({
    panNumber: '',
    gstNumber: '',
    accountNumber: '',
    ifscCode: '',
    panFile: null,
    gstFile: null,
    chequeFile: null
  });

  const [validation, setValidation] = useState({
    panNumber: { valid: false, verified: false },
    gstNumber: { valid: false, verified: false },
    accountNumber: { valid: false, verified: false },
    ifscCode: { valid: false, verified: false },
    panFile: { valid: false },
    gstFile: { valid: false },
    chequeFile: { valid: false }
  });

  // GST Details state
  const [gstDetails, setGstDetails] = useState(null);

  // Check if user is individual
  const isIndividual = user?.profile?.type === 'INDIVIDUAL';

  // Field enablement logic
  const canEditGST = !isIndividual && validation.panNumber.verified;
  const canEditBank = validation.panNumber.verified &&
    (isIndividual || kycData.gstNumber === '' || validation.gstNumber.verified);
  const canUploadDocs = validation.panNumber.verified &&
    (isIndividual || kycData.gstNumber === '' || validation.gstNumber.verified) &&
    validation.accountNumber.verified &&
    validation.ifscCode.verified;
  const canSubmit = canUploadDocs &&
    validation.panFile.valid &&
    (isIndividual || kycData.gstNumber === '' || validation.gstFile.valid) &&
    validation.chequeFile.valid;

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setKycData(prev => ({
        ...prev,
        panNumber: user.profile.pancard || '',
        gstNumber: isIndividual ? '' : user.profile.GST || '', // Only set GST if not individual
        accountNumber: user?.profile?.bankAccountNumber || '',
        ifscCode: user?.profile?.ifscCode || ''
      }));

      setValidation(prev => ({
        ...prev,
        panNumber: {
          valid: !!user?.profile?.pancard,
          verified: user?.profile?.isPanCardVerified
        },
        gstNumber: {
          valid: isIndividual ? true : !!user?.profile?.GST, // GST is optional for individuals
          verified: isIndividual ? true : user?.profile?.isGstInfo // Mark as verified for individuals
        },
        accountNumber: {
          valid: !!user?.profile?.bankAccountNumber,
          verified: user?.profile?.BankData?.account_status === "VALID" ? true : false
        },
        ifscCode: {
          valid: !!user?.profile?.ifscCode,
          verified: user?.profile?.BankData?.account_status === "VALID" ? true : false
        },
        panFile: {
          valid: user?.profile?.IspanImageupload === true
        },
        chequeFile: {
          valid: user?.profile?.isCheckbookUpload === true
        }
        
      }));

      // Set GST details if available and not individual
      if (!isIndividual && user.profile.GSTData) {
        setGstDetails(user?.profile?.GSTData);
      }
    }
  }, [user, isIndividual]);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (files) {
      // Handle file uploads
      const file = files[0];
      setKycData(prev => ({ ...prev, [name]: file }));

      // File validation
      const isValid = file &&
        (file.type === 'image/jpeg' ||
          file.type === 'image/png' ||
          file.type === 'application/pdf') &&
        file.size <= 2 * 1024 * 1024;

      setValidation(prev => ({
        ...prev,
        [name]: { ...prev[name], valid: isValid }
      }));
      return;
    }

    // Update field value
    setKycData(prev => ({ ...prev, [name]: value }));

    // Field validation
    let isValid = false;
    switch (name) {
      case 'panNumber':
        isValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
        setValidation(prev => ({
          ...prev,
          panNumber: { ...prev.panNumber, valid: isValid, verified: false }
        }));
        break;
      case 'gstNumber':
        // Skip validation for individuals
        if (isIndividual) {
          isValid = true;
        } else {
          isValid = value === '' || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value);
        }
        setValidation(prev => ({
          ...prev,
          gstNumber: { ...prev.gstNumber, valid: isValid, verified: false }
        }));
        // Clear GST details if number changes
        if (value !== kycData.gstNumber) {
          setGstDetails(null);
        }
        break;
      case 'accountNumber':
        isValid = /^[0-9]{9,18}$/.test(value);
        setValidation(prev => ({
          ...prev,
          accountNumber: { ...prev.accountNumber, valid: isValid, verified: false }
        }));
        break;
      case 'ifscCode':
        isValid = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value);
        setValidation(prev => ({
          ...prev,
          ifscCode: { ...prev.ifscCode, valid: isValid, verified: false }
        }));
        break;
      default:
        break;
    }
  };

  const verifyPAN = async () => {
    if (validation.panNumber.verified || user?.profile?.isPanCardVerified) return;

    if (!validation.panNumber.valid) {
      showSnackbar('Please enter a valid PAN number', 'error');
      return;
    }

    setLoading((prev) => ({ ...prev, pan: true }));

    try {
      await addPanCard(kycData.panNumber);
      setValidation((prev) => ({
        ...prev,
        panNumber: { ...prev.panNumber, verified: true },
      }));

      showSnackbar('PAN verified successfully', 'success');
    } catch (error) {
      showSnackbar(error.message || 'PAN verification failed', 'error');
    } finally {
      setLoading((prev) => ({ ...prev, pan: false }));
    }
  };

  const verifyGST = async () => {
    if (isIndividual || validation.gstNumber.verified || user?.profile?.isGstInfo) return;

    if (!validation.gstNumber.valid) {
      showSnackbar('Please enter a valid GST number', 'error');
      return;
    }

    setLoading(prev => ({ ...prev, gst: true }));
    try {
      // In a real app, you would call an API to verify GST
      // For now, we'll use the existing GST data if available
      if (user?.profile?.GSTData) {
        setGstDetails(user.profile.GSTData);
        setValidation(prev => ({
          ...prev,
          gstNumber: { ...prev.gstNumber, verified: true }
        }));
        showSnackbar('GST verified successfully', 'success');
      } else {
        // Simulate API call
        const response = await addGST(kycData.gstNumber);
        setGstDetails(response.data); // Assuming API returns GST details
        setValidation(prev => ({
          ...prev,
          gstNumber: { ...prev.gstNumber, verified: true }
        }));
        showSnackbar('GST verified successfully', 'success');
      }
    } catch (error) {
      showSnackbar(error.message || 'GST verification failed', 'error');
    } finally {
      setLoading(prev => ({ ...prev, gst: false }));
    }
  };

  const verifyBankDetails = async () => {
    if (validation.accountNumber.verified && validation.ifscCode.verified) return;

    if (!validation.accountNumber.valid || !validation.ifscCode.valid) {
      showSnackbar('Please enter valid bank details', 'error');
      return;
    }

    setLoading(prev => ({ ...prev, bank: true }));
    try {
      await addBankDetails(kycData.accountNumber, kycData.ifscCode);
      setValidation(prev => ({
        ...prev,
        accountNumber: { ...prev.accountNumber, verified: true },
        ifscCode: { ...prev.ifscCode, verified: true }
      }));
      showSnackbar('Bank details verified successfully', 'success');
    } catch (error) {
      showSnackbar('Bank verification failed', 'error');
    } finally {
      setLoading(prev => ({ ...prev, bank: false }));
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      showSnackbar("Please complete all required fields", "error");
      return;
    }

    setLoading((prev) => ({ ...prev, submit: true }));

    try {
      const formData = new FormData();

      if (kycData.panFile) {
        formData.append("pancard", kycData.panFile);
      }

      if (kycData.chequeFile) {
        formData.append("check", kycData.chequeFile);
      }

      if (!isIndividual && kycData.gstFile) {
        formData.append("gst", kycData.gstFile);
      }

      await uploadImage(formData);

      showSnackbar("KYC submitted successfully!", "success");
    } catch (error) {
      showSnackbar(error.message || "Submission failed. Please try again.", "error");
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  const FileUploadField = ({ name, label, disabled }) => {
    const file = kycData[name];
    const isValid = validation[name]?.valid;

    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center">
          <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer 
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
            ${isValid ? 'border-green-500 bg-green-50' :
              file ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300 hover:border-gray-400'}`}>
            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
              {file ? (
                <>
                  <FiCheckCircle className={`w-8 h-8 mb-2 ${isValid ? 'text-green-500' : 'text-yellow-500'}`} />
                  <p className="mb-1 text-sm text-gray-700 truncate max-w-xs">{file.name}</p>
                  <p className="text-xs text-gray-500">{Math.round(file.size / 1024)} KB</p>
                </>
              ) : (
                <>
                  <FiUpload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="mb-1 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span>
                  </p>
                  <p className="text-xs text-gray-500">JPG, PNG or PDF (max 2MB)</p>
                </>
              )}
            </div>
            <input
              type="file"
              name={name}
              className="hidden"
              onChange={handleChange}
              accept="image/*,.pdf"
              disabled={disabled}
            />
          </label>
          {file && !isValid && (
            <button
              type="button"
              onClick={() => setKycData(prev => ({ ...prev, [name]: null }))}
              className="ml-2 p-2 text-red-500 hover:text-red-700"
              disabled={disabled}
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Complete Your KYC Verification
            </h1>
            <div className="flex items-center space-x-2">
              {user?.profile?.isPanCardVerified && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                  <FiCheckCircle className="mr-1" /> PAN Verified
                </span>
              )}
              {!isIndividual && user?.profile?.isGstInfo && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                  <FiCheckCircle className="mr-1" /> GST Verified
                </span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
            {/* PAN Card Section */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">PAN Card Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PAN Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="panNumber"
                      value={kycData.panNumber}
                      onChange={handleChange}
                      placeholder="ABCDE1234F"
                      className={`block w-full px-4 py-3 rounded-lg border ${validation.panNumber.verified ? 'border-green-500 bg-green-50' :
                        validation.panNumber.valid ? 'border-blue-500 bg-blue-50' :
                          kycData.panNumber ? 'border-yellow-500 bg-yellow-50' :
                            'border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                      disabled={validation.panNumber.verified || user?.profile?.isPanCardVerified}
                    />
                    {(validation.panNumber.verified || user?.profile?.isPanCardVerified) && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <FiCheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={verifyPAN}
                    disabled={!validation.panNumber.valid || validation.panNumber.verified || user?.profile?.isPanCardVerified}
                    className={`w-full px-4 py-3 rounded-lg font-medium text-white ${validation.panNumber.verified || user?.profile?.isPanCardVerified ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center`}
                  >
                    {loading.pan ? (
                      <FiLoader className="animate-spin h-5 w-5" />
                    ) : validation.panNumber.verified || user?.profile?.isPanCardVerified ? (
                      'Verified'
                    ) : (
                      'Verify'
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* GST Section - Only show if not individual */}
            {!isIndividual && (
              <div className={`mb-8 pb-8 border-b border-gray-200 ${!canEditGST ? 'opacity-50' : ''}`}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">GST Details (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GST Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="gstNumber"
                        value={kycData.gstNumber}
                        onChange={handleChange}
                        placeholder="22ABCDE1234F1Z5"
                        className={`block w-full px-4 py-3 rounded-lg border ${validation.gstNumber.verified ? 'border-green-500 bg-green-50' :
                          validation.gstNumber.valid ? 'border-blue-500 bg-blue-50' :
                            kycData.gstNumber ? 'border-yellow-500 bg-yellow-50' :
                              'border-gray-300'
                          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                        disabled={!canEditGST || validation.gstNumber.verified || user?.profile?.isGstInfo}
                      />
                      {(validation.gstNumber.verified || user?.profile?.isGstInfo) && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <FiCheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={verifyGST}
                      disabled={!canEditGST || !validation.gstNumber.valid || validation.gstNumber.verified || user?.profile?.isGstVerified || kycData.gstNumber === ''}
                      className={`w-full px-4 py-3 rounded-lg font-medium text-white ${validation.gstNumber.verified || user?.profile?.isGstVerified ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center`}
                    >
                      {loading.gst ? (
                        <FiLoader className="animate-spin h-5 w-5" />
                      ) : validation.gstNumber.verified || user?.profile?.isGstVerified ? (
                        'Verified'
                      ) : kycData.gstNumber === '' ? (
                        'Skip'
                      ) : (
                        'Verify'
                      )}
                    </button>
                  </div>
                </div>

                {/* GST Details Display */}
                {gstDetails && (
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                      <FiInfo className="mr-2" /> GST Verification Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Legal Name:</p>
                        <p className="font-medium">{gstDetails.legal_name}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Trade Name:</p>
                        <p className="font-medium">{gstDetails.trade_name}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Business Type:</p>
                        <p className="font-medium">{gstDetails.constitution_of_business}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Registration Date:</p>
                        <p className="font-medium">{gstDetails.date_of_registration}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status:</p>
                        <p className="font-medium">{gstDetails.status}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">State Jurisdiction:</p>
                        <p className="font-medium">{gstDetails.state_jurisdiction}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Center Jurisdiction:</p>
                        <p className="font-medium">{gstDetails.center_jurisdiction}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Taxpayer Type:</p>
                        <p className="font-medium">{gstDetails.taxpayer_type}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bank Details Section */}
            <div className={`mb-8 pb-8 border-b border-gray-200 ${!canEditBank ? 'opacity-50' : ''}`}>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Bank Account Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="accountNumber"
                      value={kycData.accountNumber}
                      onChange={handleChange}
                      placeholder="1234567890"
                      className={`block w-full px-4 py-3 rounded-lg border ${validation.accountNumber.verified ? 'border-green-500 bg-green-50' :
                        validation.accountNumber.valid ? 'border-blue-500 bg-blue-50' :
                          kycData.accountNumber ? 'border-yellow-500 bg-yellow-50' :
                            'border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                      disabled={!canEditBank || validation.accountNumber.verified}
                    />
                    {validation.accountNumber.verified && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <FiCheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IFSC Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="ifscCode"
                      value={kycData.ifscCode}
                      onChange={handleChange}
                      placeholder="ABCD0123456"
                      className={`block w-full px-4 py-3 rounded-lg border ${validation.ifscCode.verified ? 'border-green-500 bg-green-50' :
                        validation.ifscCode.valid ? 'border-blue-500 bg-blue-50' :
                          kycData.ifscCode ? 'border-yellow-500 bg-yellow-50' :
                            'border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                      disabled={!canEditBank || validation.ifscCode.verified}
                    />
                    {validation.ifscCode.verified && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <FiCheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={verifyBankDetails}
                disabled={!canEditBank || !validation.accountNumber.valid || !validation.ifscCode.valid ||
                  (validation.accountNumber.verified && validation.ifscCode.verified)}
                className={`px-6 py-3 rounded-lg font-medium text-white ${validation.accountNumber.verified && validation.ifscCode.verified ?
                  'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center`}
              >
                {loading.bank ? (
                  <FiLoader className="animate-spin h-5 w-5" />
                ) : validation.accountNumber.verified && validation.ifscCode.verified ? (
                  'Verified'
                ) : (
                  'Verify Bank Details'
                )}
              </button>
            </div>

            {/* Document Upload Section */}
            <div className={`mb-8 ${!canUploadDocs ? 'opacity-50' : ''}`}>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUploadField
                  name="panFile"
                  label="PAN Card Copy (Front)"
                  disabled={!canUploadDocs}
                />
                {/* Only show GST file upload if not individual and GST number exists */}
                {!isIndividual && kycData.gstNumber && (
                  <FileUploadField
                    name="gstFile"
                    label="GST Certificate"
                    disabled={!canUploadDocs}
                  />
                )}
                <FileUploadField
                  name="chequeFile"
                  label="Cancelled Cheque or Bank Statement"
                  disabled={!canUploadDocs}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`px-8 py-3 rounded-lg font-medium text-white ${canSubmit ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                  } focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center`}
              >
                {loading.submit ? (
                  <>
                    <FiLoader className="animate-spin mr-2 h-5 w-5" />
                    Submitting...
                  </>
                ) : (
                  'Submit KYC'
                )}
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Need Help with KYC?</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>• Ensure all documents are clear and legible</p>
              <p>• PAN card should show your name clearly</p>
              <p>• Cancelled cheque must have your name and account number</p>
              {!isIndividual && <p>• For GST certificate, ensure GSTIN is visible</p>}
              <p className="mt-4">Contact support at <a href="mailto:support@ridextra.com" className="text-blue-600 hover:underline">support@ridextra.com</a> for any questions.</p>
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        visible={snackbar.visible}
        onClose={hideSnackbar}
      />
    </div>
  );
}