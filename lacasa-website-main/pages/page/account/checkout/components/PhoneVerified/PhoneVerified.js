import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const PhoneVerified = ({ setPhoneVerifiedModel, phoneNumberEntered, setIsPhoneVerified, setIsLoading, confirm, verifyProvider }) => {
    const { t } = useTranslation();
    const [code, setCode] = useState('');

    const saveInLocal = (phone) => {
        localStorage.setItem('phoneNumberVerified', JSON.stringify({
            phoneNumber: phone,
            verified: true
        }));
    };

    const verifyFirebaseOTP = async () => {
        setIsLoading(true)
        try {
            if (code.trim() === '') {
                toast.error(t("Please enter the OTP code."));
                return;
            }
            const credential = await confirm.confirm(code);
            console.log(credential);
            // Verification successful
            toast.success("Phone number verified successfully!");
            setIsPhoneVerified(true);
            saveInLocal(phoneNumberEntered);
            setPhoneVerifiedModel(false);
        } catch (error) {
            console.error("Firebase Authentication Error:", error.code, error.message);
            toast.error(t("Invalid OTP. Please try again."));
        } finally {
            setIsLoading(false)
        }
    };


    const verifyOTP = async () => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('phone', phoneNumberEntered);
        formData.append('otp', code);

        try {
            if (code.trim() === '') {
                toast.error(t("Please enter the OTP code."));
                return;
            }
            const response = await axios.post(`${process.env.NEXT_APP_BASE_URL}/verify_otp`, formData);
            // successfully
            if (response.data?.status === "verified") {
                toast.success("Phone number verified successfully!");
                setPhoneVerifiedModel(true);
                saveInLocal(phoneNumberEntered);
            }
            else {
                toast.error(t("Invalid OTP. Please try again."));
            }
            // Verification successful
            setPhoneVerifiedModel(false);
            setIsPhoneVerified(true);
        } catch (error) {
            console.error("Authentication Error:", error.code, error.message);
            toast.error(t("Invalid OTP. Please try again."));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='verify-model'>
            <div className="container">
                <div className="content">
                    <h2 className="title">
                        {t("Enter The Activation Code")}
                    </h2>
                    <p className="description" style={{ lineHeight: "20px" }}>
                        {t("We sent the Activation code to your phone number")}
                        <br />
                        <span>{phoneNumberEntered}</span>
                    </p>
                    <input
                        type="tel"
                        pattern="[0-9]*"
                        className="input"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <div className='btns-holder'>
                        <button
                            className={`btn px-4 pt-2 pb-2`}
                            style={{ border: "0px", background: "#c50808", color: "white" }}
                            type="button"
                            onClick={() => setPhoneVerifiedModel(false)}
                        >
                            {t("Cancel")}
                        </button>
                        <button
                            className={`btn px-4 pt-2 pb-2`}
                            style={{ border: "0px", background: "black", color: "white" }}
                            type="button"
                            onClick={() => {
                                if (verifyProvider === "API") {
                                    verifyOTP();
                                } else if (verifyProvider === "FIREBASE") {
                                    verifyFirebaseOTP();
                                }
                            }}
                            disabled={code.length < 6}
                        >
                            {t("Submit")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhoneVerified;
