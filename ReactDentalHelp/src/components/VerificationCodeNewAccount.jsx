import { useState } from 'react';
import PropTypes from 'prop-types';
function VerificationCodeNewAccount({ isOpen, onClose, onSubmit }) {
    const [code, setCode] = useState('');

    const handleSubmit = () => {
        onSubmit(code);
    };

    if (!isOpen) return null;

    return (
        <div className="dialog-overlay">
            <div className="dialog-content">
                <h2>Introduceți Codul de Verificare</h2>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Cod de verificare"
                />
                <button onClick={handleSubmit}>Trimite</button>
                <button onClick={onClose}>Anulează</button>
            </div>
        </div>
    );
}
VerificationCodeNewAccount.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};
export default VerificationCodeNewAccount;
