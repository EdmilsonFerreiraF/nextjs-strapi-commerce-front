import Card from 'react-credit-cards';

const CreditCardMethod = ({ cardData, handleCallback, handleSubmit, handleCardInputChange, handleCardInputFocus }) => {
    const {
        type,
        number,
        name,
        installments,
        expiry,
        cvc,
        taxId,
        store,
        issuer,
        focused,
        formData,
    } = cardData

    return (
        <>
            <div className="mb-5">
                <Card
                    number={number}
                    name={name}
                    expiry={expiry}
                    cvc={cvc}
                    focused={focused}
                    callback={() => handleCallback("card")}
                />
            </div>
            <form ref={c => (CreditCardMethod.form = c)} onSubmit={handleSubmit}>
                <div className="form-group my-4">
                    <input
                        type="tel"
                        name="number"
                        className="form-control"
                        placeholder="Card Number"
                        pattern="[\d| ]{16,22}"
                        required
                        onChange={(e) => handleCardInputChange(e, "card")}
                        value={number}
                        onFocus={handleCardInputFocus}
                    />
                    {/* <small className="position-absolute">E.g.: 49..., 51..., 36..., 37...</small> */}
                </div>
                <div className="row my-4">
                    <div className="form-group col-6 col-md-6">
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Name"
                            required
                            onChange={(e) => handleCardInputChange(e, "card")}
                            value={name}
                            onFocus={handleCardInputFocus}
                        />
                    </div>
                    <div className="col-6 col-md-6">
                        <select id="inputInstallments" className="form-select"
                            value={installments}
                            name="installments"
                            onChange={(e) => handleCardInputChange(e, "card")}>
                            <option>Parcelas</option>
                            <option>...</option>
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <input
                            type="tel"
                            name="expiry"
                            className="form-control"
                            placeholder="Valid Thru"
                            pattern="\d\d/\d\d"
                            required
                            onChange={(e) => handleCardInputChange(e, "card")}
                            value={expiry}
                            onFocus={handleCardInputFocus}
                        />
                    </div>
                    <div className="col-6">
                        <input
                            type="tel"
                            name="cvc"
                            className="form-control"
                            placeholder="CVC"
                            pattern="\d{3,4}"
                            required
                            onChange={(e) => handleCardInputChange(e, "card")}
                            value={cvc}
                            onFocus={handleCardInputFocus}
                        />
                    </div>
                    <div className="col-6">
                        <input
                            type="tel"
                            name="cpf"
                            className="form-control"
                            placeholder="CPF"
                            pattern="\d{3,4}"
                            required
                            onChange={(e) => handleCardInputChange(e, "card")}
                            value={taxId}
                            onFocus={handleCardInputFocus}
                        />
                    </div>
                </div>
                <div className="col-12 mt-3">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="gridCheck" />
                        <label className="form-check-label" htmlFor="gridCheck">
                            Salvar cartão
                        </label>
                    </div>
                </div>
                <input type="hidden" name="issuer" value={issuer} />
            </form>
        </>
    )
}

export default CreditCardMethod