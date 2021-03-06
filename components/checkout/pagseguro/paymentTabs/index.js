
import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router';
import axios from 'axios'

import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
} from "../../../../components/utils";
import GlobalContext from "../../../../context/GlobalContext";

import StepsMenu from './stepsMenu';
import Address from './address';
import BackToMethods from '../backToMethods';
import CreditCard from './paymentMethods/creditCard';
import DebitCard from './paymentMethods/debitCard';
import Boleto from './paymentMethods/boleto';
import Confirm from './confirm';
import Controls from '../controls';
import PaymentMethods from './paymentMethods';
import { getStrapiURL } from "../../../../lib/api"
import Pix from './paymentMethods/pix';

const PaymentTabs = () => {
  const globalContext = useContext(GlobalContext);

  const { cart } = globalContext;

  let [creditCardData, setCreditCardData] = useState({
    type: "CREDIT_CARD",
    number: "",
    name: "Nome do usuário",
    installments: "parcelas",
    expiry: "01/23",
    cvc: "1234",
    taxId: "62550787790",
    store: false,
    issuer: "",
    focused: "",
    creditCardFormData: null
  })

  let [debitCardData, setDebitCardData] = useState({
    type: "DEBIT_CARD",
    number: "",
    name: "",
    installments: "",
    expiry: "",
    cvc: "",
    taxId: "",
    store: false,
    issuer: "",
    focused: "",
    debitCardFormData: null
  })

  let [addressData, setAddressData] = useState({
    name: "Nome do usuário",
    phone: "12345678910",
    address: "Endereço do usuário",
    address2: "Endereço do usuário 2",
    zip: "12345678",
    city: "Cidade do usuário",
    neighbourhood: "Bairro do usuário",
    street: "Rua do usuário",
    state: "BA",
    number: "1234",
    complement: "Complemento",
    addressFormData: null
  })

  let [boletoData, setBoletoData] = useState({
    type: "BOLETO",

    name: "Nome do usuário",
    taxId: "",
    email: "",
    boletoFormData: null
  })

  let [pixData, setPixData] = useState({
    expiracao: "01/23",
    type: "PIX",
    taxId: "12345678910",
    nome: "Nome do usuário",
    original: "",
    chave: "",
    solicitacaoPagador: "",
    issuer: "",
    infoAdicionais: [],
    pixFormData: null
  })

  let [paymentTab, setPaymentTab] = useState(0)

  let [paymentMethod, setPaymentMethod] = useState(0)

  const router = useRouter()

  const handleCallback = ({ issuer }, isValid, entity) => {
    if (isValid) {
      if (entity === "credit_card") {
        setCreditCardData({ ...creditCardData, issuer });
      } else {
        setDebitCardData({ ...debitCardData, issuer });
      }
    }
  };

  const handleCardInputFocus = ({ target }) => {
    setCreditCardData({
      ...creditCardData,
      focused: target.name
    });
  };
  const handleAddressInputFocus = ({ target }) => {
    setAddressData({
      ...addressData,
      focused: target.name
    });
  };

  const handleInputChange = ({ target }, entity) => {
    if (entity === "credit_card") {
      if (target.name === "number") {
        target.value = formatCreditCardNumber(target.value);
      } else if (target.name === "expiry") {
        target.value = formatExpirationDate(target.value);
      } else if (target.name === "cvc") {
        target.value = formatCVC(target.value);
      }

      setCreditCardData({ ...creditCardData, [target.name]: target.value });
    } else if (entity === "debit_card") {
      setDebitCardData({ ...debitCardData, [target.name]: target.value });
    } else if (entity === "boleto") {
      setBoletoData({ ...boletoData, [target.name]: target.value });
    } else if (entity === "pix") {
      setPixData({ ...pixData, [target.name]: target.value });
      
    } else {
      
      setAddressData({ ...addressData, [target.name]: target.value });
    }
  };
  console.log('items', cart.items[0])

  const sendPaymentData = async (entity) => {
    const description = "MywonderfulStrapiblogpayment"
    const softDescriptor = "dwdq"
    const currency = "BRL"
    const phoneType = "MOBILE"
    const userEmail = "user_email@email.com"
    const countryPhone = 55
    const countryAddress = "BRA"
    const notificationUrls = "http://localhost:3000/notifications"

    const method = creditCardData.creditCardFormData || debitCardData.debitCardFormData || boletoData.boletoFormData

    const address = addressData.addressFormData

    let holder
    let paymentMethod

    if (method?.type === "BOLETO") {
      holder = {
        name: method.name,
        tax_id: method.taxId,
        email: userEmail,
        address: {
          street: address.street,
          number: address.number,
          complement: address.complement,
          locality: address.neighbourhood,
          city: address.city,
          region: address.city,
          region_code: address.state,
          // region: "Sao Paulo",
          // region_code: "SP",
          country: countryAddress,
          postal_code: address.zip,
        }
      }

      paymentMethod =
      {
        type: method.type,
        boleto: {
          due_date: "2024-12-31",
          instruction_lines: {
            line_1: "Pagamento processado para DESC Fatura",
            line_2: "Via PagSeguro"
          },
          holder
        }
      }
    } else if (method?.type === "CREDIT_CARD") {
      holder = {
        name: creditCardData.creditCardFormData.name,
      }

      paymentMethod = {
        type: method.type,
        installments: method.installments,
        capture: true,
        soft_descriptor: softDescriptor,
        card: {
          number: method.number.split(" ").join(""),
          exp_month: method.expiry.slice(0, 2),
          exp_year: `20${method.expiry.slice(3, 5)}`,
          // exp_month: "01",
          // exp_year: "2025",
          security_code: method.cvc,
          holder,
          store: method.store,
        },
      }
    } else if (method?.type === "DEBIT_CARD") {
      holder = {
        name: method.name,
      }

      paymentMethod = {
        type: method.type,
        installments: method.installments,
        capture: true,
        soft_descriptor: softDescriptor,
        card: {
          number: method.number.split(" ").join(""),
          exp_month: method.expiry.slice(0, 2),
          exp_year: `20${method.expiry.slice(3, 5)}`,
          security_code: method.cvc,
          holder: {
            name: method.name,
          },
          store: method.store,
        },
        authentication_method: {
          type: "INAPP",
          cavv: "4251",
          eci: "05",
        }
      }
    } else {
     
    }

    const paymentData = {
      // "reference_id": this.name,
      customer: {
        name: method?.name,
        email: userEmail,
        tax_id: method?.taxId,
        phones: [
          {
            country: countryPhone,
            area: address.phone.slice(0, 2),
            number: address.phone.slice(2, 11),
            type: phoneType
          }
        ]
      },
      items: cart.items.map(item => {
        // reference_id: items.reference_id,
        return {
          name: item.attributes.title,
          quantity: item.quantity,
          unit_amount: 1,
        }
      }
      ),
      qr_code: {
        amount: {
          // value: cart.total
          value: 500
        }
      },
      shipping: {
        address: {
          street: address.street,
          number: address.number,
          complement: address.complement,
          locality: address.neighbourhood,
          city: address.city,
          region_code: address.state,
          country: countryAddress,
          postal_code: address.zip,
        }
      },
      notification_urls: [
        notificationUrls
      ],
      charges: [
        {
          // reference_id: this.name,
          description,
          amount: {
            // value: cart.total,
            value: 500,
            currency,
          },
          payment_method: paymentMethod,
          notification_urls: [
            "http://localhost:3000/order/notifications"
          ]
        }
      ],
    }

    const boleto = boletoData.boletoFormData && {
      customer: {
        name: addressData.addressFormData.name,
        email: boletoData.boletoFormData.email,
        tax_id: boletoData.boletoFormData.taxId,
        phones: [
          {
            country: countryPhone,
            area: addressData.addressFormData.phone.slice(0, 2),
            number: addressData.addressFormData.phone.slice(2, 11),
            type: phoneType
          }
        ]
      },
      items: cart.items.map(item => {
        // reference_id: items.reference_id,
        return {
          name: item.attributes.title,
          quantity: item.quantity,
          unit_amount: 1,
        }
      }),
      qr_code: {
        amount: {
          value: cart.total
        }
      },
      shipping: {
        address: {
          street: addressData.addressFormData.street,
          // number: boletoData.boletoFormData.number,
          number: addressData.addressFormData.number,
          complement: addressData.addressFormData.complement,
          locality: addressData.addressFormData.neighbourhood,
          city: addressData.addressFormData.city,
          region_code: addressData.addressFormData.state,
          // country: addressData.addressFormData.country,
          country: countryAddress,
          postal_code: addressData.addressFormData.zip,
        }
      },
      notification_urls: [
        notificationUrls
      ],
      charges: [
        {
          // reference_id: this.name,
          description,
          amount: {
            // value: cart.total,
            value: 100,
            currency,
          },
          payment_method: {
            type: boletoData.boletoFormData.type,
            boleto: {
              due_date: "2024-12-31",
              instruction_lines: {
                line_1: "Pagamento processado para DESC Fatura",
                line_2: "Via PagSeguro"
              },
              holder: {
                name: boletoData.boletoFormData.name,
                tax_id: boletoData.boletoFormData.taxId,
                email: userEmail,
                address: {
                  // street: "Avenida Brigadeiro Faria Lima",
                  // number: "1384",
                  // locality: "Pinheiros",
                  // city: "Sao Paulo",
                  // region: "Sao Paulo",
                  // region_code: "SP",
                  // country: countryAddress,
                  // postal_code: "01452002",

                  street: addressData.addressFormData.street,
                  // number: boletoData.boletoFormData.number,
                  number: addressData.addressFormData.number,
                  complement: addressData.addressFormData.complement,
                  locality: addressData.addressFormData.neighbourhood,
                  city: addressData.addressFormData.city,
                  region: addressData.addressFormData.city,
                  region_code: addressData.addressFormData.state,
                  // country: addressData.addressFormData.country,
                  country: countryAddress,
                  postal_code: addressData.addressFormData.zip,
                }
              }
            }
          }
        }
      ],
    }

    const creditCard = creditCardData.creditCardFormData && {
      // "reference_id": this.name,
      customer: {
        name: creditCardData.creditCardFormData.name,
        email: userEmail,
        tax_id: creditCardData.creditCardFormData.taxId,
        phones: [
          {
            country: countryPhone,
            area: addressData.addressFormData.phone.slice(0, 2),
            number: addressData.addressFormData.phone.slice(2, 11),
            type: phoneType
          }
        ]
      },
      items: cart.items.map(item => {
        // reference_id: items.reference_id,
        return {
          name: item.attributes.title,
          quantity: item.quantity,
          unit_amount: 1,
        }
      }
      ),
      qr_code: {
        amount: {
          // value: cart.total
          value: 500
        }
      },
      shipping: {
        address: {
          street: addressData.addressFormData.street,
          number: addressData.addressFormData.number,
          complement: addressData.addressFormData.complement,
          locality: addressData.addressFormData.neighbourhood,
          city: addressData.addressFormData.city,
          region_code: addressData.addressFormData.state,
          country: countryAddress,
          postal_code: addressData.addressFormData.zip,
        }
      },
      notification_urls: [
        notificationUrls
      ],
      charges: [
        {
          // reference_id: this.name,
          description,
          amount: {
            // value: cart.total,
            value: 500,
            currency,
          },
          payment_method: {
            type: creditCardData.creditCardFormData.type,
            installments: creditCardData.creditCardFormData.installments,
            capture: true,
            soft_descriptor: softDescriptor,
            card: {
              number: creditCardData.creditCardFormData.number.split(" ").join(""),
              exp_month: creditCardData.creditCardFormData.expiry.slice(0, 2),
              exp_year: `20${creditCardData.creditCardFormData.expiry.slice(3, 5)}`,
              // exp_month: "01",
              // exp_year: "2025",
              security_code: creditCardData.creditCardFormData.cvc,
              holder: {
                name: creditCardData.creditCardFormData.name,
              },
              store: creditCardData.creditCardFormData.store,
            },
          },
          notification_urls: [
            "http://localhost:3000/order/notifications"
          ]
        }
      ],
    }

    const debitCard = debitCardData.debitCardFormData && {
      // "reference_id": this.name,
      customer: {
        name: debitCardData.debitCardFormData?.name,
        // email: debitCardData.debitCardFormData?.email,
        email: userEmail,
        tax_id: debitCardData.debitCardFormData?.taxId,
        phones: [
          {
            country: countryPhone,
            area: addressData.addressFormData.phone.slice(0, 2),
            number: addressData.addressFormData.phone.slice(2, 11),
            type: phoneType
          }
        ]
      },
      items: cart.items.map(item => {
        // reference_id: items.reference_id,
        return {
          name: item.attributes.title,
          quantity: item.quantity,
          unit_amount: 1,
        }
      }
      ),
      qr_code: {
        amount: {
          // value: cart.total
          value: 500
        }
      },
      shipping: {
        address: {
          street: addressData.addressFormData.street,
          number: addressData.addressFormData.number,
          complement: addressData.addressFormData.complement,
          locality: addressData.addressFormData.neighbourhood,
          city: addressData.addressFormData.city,
          region_code: addressData.addressFormData.state,
          country: countryAddress,
          postal_code: addressData.addressFormData.zip,
        }
      },
      notification_urls: [
        notificationUrls
      ],
      charges: [
        {
          // reference_id: this.name,
          description,
          amount: {
            // value: cart.total,
            value: 500,
            currency,
          },
          payment_method: {
            type: debitCardData.debitCardFormData.type,
            installments: debitCardData.debitCardFormData.installments,
            capture: true,
            soft_descriptor: softDescriptor,
            card: {
              number: debitCardData.debitCardFormData.number.split(" ").join(""),
              exp_month: debitCardData.debitCardFormData.expiry.slice(0, 2),
              exp_year: `20${debitCardData.debitCardFormData.expiry.slice(3, 5)}`,
              security_code: debitCardData.debitCardFormData.cvc,
              holder: {
                name: debitCardData.debitCardFormData.name,
              },
              store: debitCardData.debitCardFormData.store,
            },
            authentication_method: {
              type: "INAPP",
              cavv: "4251",
              eci: "05",
            }
          },
          notification_urls: [
            notificationUrls
          ]
        }
      ],
    }

    const pix = pixData.pixFormData &&  {
        calendario: {
            expiracao: "3600"
        },
        devedor: {
            cpf: pixData.pixFormData.taxId,
            nome: pixData.pixFormData.nome
        },
        valor: {
            "original": "1.20"
        },
        chave: "73fa7d23-4d83-4f44-b4eb-9eeec083b1ee",
        solicitacaoPagador: "Serviço realizado.",
        infoAdicionais: [
            {
                nome: "Campo 1",
                valor: "Informação Adicional1 do PSP-Recebedor"
            },
            {
                nome: "Campo 2",
                valor: "Informação Adicional2 do PSP-Recebedor"
            }
        ]
    }

    const res = pixData.pixFormData ? await axios.post(getStrapiURL('/api/orders/pagseguropix'), pix) : await axios.post(getStrapiURL('/api/orders/pagseguro'), paymentData)
      .then(res => { console.log(res); return res })
      .catch(err => console.error(err));
    console.log('res', res)
  }

  const handleSubmit = (e, entity) => {
    e.preventDefault();
    const { issuer } = creditCardData;
    const formData = [...e.target.elements]
      .filter(d => d.name)
      .reduce((acc, d) => {
        acc[d.name] = d.value;
        return acc;
      }, {});

    if (entity === "credit_card") {
      setCreditCardData({ ...creditCardData, creditCardFormData: { ...creditCardData, formData } });
    } else if (entity === "debit_card") {
      setDebitCardData({ ...debitCardData, debitCardFormData: { ...debitCardData, formData } });
    } else if (entity === "boleto") {
      console.log('boletoData', boletoData)
      console.log('formData', formData)
      setBoletoData({ ...boletoData, boletoFormData: { ...boletoData, formData } });
    } else if (entity === "pix") {
      setPixData({ ...pixData, pixFormData: { ...pixData, formData } });
    } else {
      setAddressData({ ...addressData, addressFormData: formData });
    }

    handleNextTab()

    //  e.target.querySelector("form").reset();
    console.log('e.target', e.target)
  };

  const handleBuyButton = () => {
    sendPaymentData();
  }

  const handlePreviousTab = () => {
    setPaymentTab(paymentTab - 1)
  }

  const handleNextTab = () => {
    setPaymentTab(paymentTab + 1)
  }

  const handlePaymentTab = (tab) => {
    setPaymentTab(tab)
  }

  const handlePaymentMethod = (method) => {
    setPaymentMethod(method)
  }

  useEffect(() => {
    if (paymentTab === -1) {
      router.replace("http://localhost:3000/cart")
    }
  }, [paymentTab])

  return (
    <div className="container bg-light py-4 m-auto mw-805px" onSubmit={handleNextTab} >
      <StepsMenu
        addressFormData={addressData.addressFormData}
        creditCardFormData={creditCardData.creditCardFormData}
        debitCardFormData={debitCardData.debitCardFormData}
        boletoFormData={boletoData.boletoFormData}
        paymentTab={paymentTab} handlePaymentTab={handlePaymentTab}
      />
      {console.log('addressData.addressFormData', addressData.addressFormData)}
      {paymentTab === 0 &&
        <Address
          paymentTab={paymentTab}
          handlePreviousTab={handlePreviousTab}
          handleNextTab={handleNextTab}
          handleSubmit={handleSubmit}
          addressData={addressData}
          handleAddressInputFocus={handleAddressInputFocus}
          handleBuyButton={handleBuyButton}
          handleInputChange={e => handleInputChange(e, "address")} />
      }

      {paymentTab === 1 && addressData.addressFormData &&
        <div className="container col-auto col-md-10 col-lg-10 mt-4 mb-5 h-574">
          {paymentMethod > 0 &&
            <BackToMethods handlePaymentMethod={handlePaymentMethod} />
          }
          {paymentMethod === 1 &&
            <CreditCard
              creditCardData={creditCardData}
              handleCallback={handleCallback}
              handleSubmit={handleSubmit}
              handleInputChange={e => handleInputChange(e, "credit_card")}
              handleCardInputFocus={handleCardInputFocus}
              paymentTab={paymentTab}
              handlePreviousTab={handlePreviousTab}
              handleNextTab={handleNextTab}
              handleBuyButton={handleBuyButton}
            />
          }

          {paymentMethod === 2 &&
            <DebitCard
              debitCardData={debitCardData}
              handleCallback={handleCallback}
              handleSubmit={handleSubmit}
              handleInputChange={e => handleInputChange(e, "debit_card")}
              handleCardInputFocus={handleCardInputFocus}
              paymentTab={paymentTab}
              handlePreviousTab={handlePreviousTab}
              handleNextTab={handleNextTab}
              handleBuyButton={handleBuyButton}
            />
          }

          {paymentMethod === 3 &&
            <Boleto
              boletoData={boletoData}
              handleSubmit={handleSubmit}
              handleInputChange={e => handleInputChange(e, "boleto")}
              handleCardInputFocus={handleCardInputFocus}
              paymentTab={paymentTab}
              handlePreviousTab={handlePreviousTab}
              handleNextTab={handleNextTab}
              handleBuyButton={handleBuyButton}
            />
          }
     
          {paymentMethod === 4 &&
            <Pix
              pixData={pixData}
              handleSubmit={handleSubmit}
              handleInputChange={e => handleInputChange(e, "pix")}
              handleCardInputFocus={handleCardInputFocus}
              paymentTab={paymentTab}
              handlePreviousTab={handlePreviousTab}
              handleNextTab={handleNextTab}
              handleBuyButton={handleBuyButton}
            />
          }

          {paymentMethod === 0 &&
            <PaymentMethods
              handlePaymentMethod={handlePaymentMethod}
              paymentTab={paymentTab}
              disabledNextTab
              handlePreviousTab={handlePreviousTab}
              handleNextTab={handleNextTab}
              handleSubmit={handleSubmit}
            />
          }
        </div>
      }

      {paymentTab === 2 && (addressData.addressFormData && (creditCardData.creditCardFormData || debitCardData.debitCardFormData || boletoData.boletoFormData || pixData.pixFormData)) &&
        <>
          <Confirm
            creditCardFormData={creditCardData.creditCardFormData}
            debitCardFormData={debitCardData.debitCardFormData}
            boletoFormData={boletoData.boletoFormData}
            creditCardData={creditCardData}
            debitCardData={debitCardData}
            boletoData={boletoData}
            pixData={pixData}
            addressFormData={addressData.addressFormData}
          />
          <Controls paymentTab={paymentTab}
            disabledNextTab
            handlePreviousTab={handlePreviousTab}
            handleNextTab={handleNextTab}
            handleSubmit={handleSubmit}
            handleBuyButton={handleBuyButton}
          />
        </>
      }
    </div>
  )
}

export default PaymentTabs