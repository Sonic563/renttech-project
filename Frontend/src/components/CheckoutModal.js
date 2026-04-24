import { useMemo, useState } from 'react';
import './PaymentModal.css';
import ModalSelect from './ModalSelect';

export default function CheckoutModal({ onClose, onSubmit, price, userEmail }) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('PICKUP');
  const [shippingZip, setShippingZip] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [cardName, setCardName] = useState('');
  const [card, setCard] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const addressRequired = useMemo(() => deliveryMethod === 'COURIER', [deliveryMethod]);

  const formatCard = (value) =>
    value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);

  const formatExpiry = (value) =>
    value.replace(/\D/g, '').replace(/(\d{2})(\d{1,2})/, '$1/$2').slice(0, 5);

  const validate = () => {
    const name = customerName.trim();
    const normalizedPhone = phone.trim().replace(/\s+/g, '');

    if (!name) return 'Add meg a neved!';
    if (name.length > 60) return 'A név maximum 60 karakter lehet.';

    if (!normalizedPhone) return 'Add meg a telefonszámod!';
    if (!/^\+?\d{9,15}$/.test(normalizedPhone)) {
      return 'Hibás telefonszám! (pl. +36301234567, 9-15 számjegy)';
    }

    if (addressRequired) {
      if (!shippingZip.trim()) return 'Add meg az irányítószámot!';
      if (!/^\d{4}$/.test(shippingZip.trim())) {
        return 'Az irányítószám 4 számjegy legyen!';
      }
      if (!shippingCity.trim()) return 'Add meg a várost!';
      if (!shippingAddress.trim()) return 'Add meg az utcát/házszámot!';
    }

    if (paymentMethod === 'CARD') {
      if (!cardName.trim()) return 'Add meg a kártyabirtokos nevét!';

      const digits = card.replace(/\s/g, '');
      if (digits.length !== 16) return 'Hibás kártyaszám! (16 számjegy)';

      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
        return 'Hibás lejárat! (MM/YY, pl. 08/28)';
      }

      const [monthString, yearString] = expiry.split('/');
      const month = Number(monthString);
      const year = 2000 + Number(yearString);
      const expEnd = new Date(year, month, 0);
      if (expEnd < new Date()) return 'A kártya lejárt!';

      if (!/^\d{3}$/.test(cvc)) return 'Hibás CVC! (3 számjegy)';
    }

    return null;
  };

  const handleSubmit = async () => {
    const errorMessage = validate();
    if (errorMessage) {
      setFormError(errorMessage);
      return;
    }

    setFormError('');
    setLoading(true);

    try {
      if (paymentMethod === 'CARD') {
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }

      await onSubmit({
        customerName: customerName.trim(),
        phone: phone.trim(),
        deliveryMethod,
        shippingZip: addressRequired ? shippingZip.trim() : '',
        shippingCity: addressRequired ? shippingCity.trim() : '',
        shippingAddress: addressRequired ? shippingAddress.trim() : '',
        note: note.trim(),
        paymentMethod,
        paymentStatus: paymentMethod === 'CARD' ? 'PAID' : 'PENDING',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="paymentOverlay">
      <div className="paymentModal">
        <h2>Megrendelés</h2>
        <p className="paymentPrice">{price} Ft</p>

        {formError && <div className="errorMessage">{formError}</div>}

        <label>Email</label>
        <input type="text" value={userEmail || ''} disabled />

        <label>Megrendelő neve *</label>
        <input
          type="text"
          value={customerName}
          maxLength={60}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Pl. Kiss Pista"
        />

        <label>Telefonszám *</label>
        <input
          type="tel"
          inputMode="numeric"
          value={phone}
          maxLength={16}
          onChange={(e) => {
            let value = e.target.value.replace(/\s+/g, '');
            value = value.replace(/(?!^)\+/g, '');
            value = value.replace(/[^\d+]/g, '');
            setPhone(value);
          }}
          placeholder="+36301234567"
        />

        <label>Átvétel módja</label>
        <ModalSelect
          value={deliveryMethod}
          onChange={(value) => {
            setDeliveryMethod(value);
            setFormError('');
          }}
          options={[
            { value: 'PICKUP', label: 'Személyes átvétel' },
            { value: 'COURIER', label: 'Futárszolgálat' },
          ]}
        />

        {addressRequired && (
          <>
            <label>Irányítószám *</label>
            <input
              type="text"
              value={shippingZip}
              onChange={(e) => setShippingZip(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="4400"
            />

            <label>Város *</label>
            <input
              type="text"
              value={shippingCity}
              onChange={(e) => setShippingCity(e.target.value)}
              placeholder="Nyíregyháza"
            />

            <label>Cím (utca, házszám) *</label>
            <input
              type="text"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Kossuth utca 12."
            />
          </>
        )}

        <label>Fizetési mód</label>
        <ModalSelect
          value={paymentMethod}
          onChange={(value) => {
            setPaymentMethod(value);
            setFormError('');
          }}
          options={[
            { value: 'COD', label: 'Utánvétel' },
            { value: 'CARD', label: 'Bankkártya' },
          ]}
        />

        {paymentMethod === 'CARD' && (
          <>
            <label>Kártyabirtokos neve *</label>
            <input
              type="text"
              placeholder="Pl. KISS PISTA"
              value={cardName}
              onChange={(e) => setCardName(e.target.value.toUpperCase())}
            />

            <label>Kártyaszám *</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={card}
              onChange={(e) => setCard(formatCard(e.target.value))}
            />

            <label>Lejárat *</label>
            <input
              type="text"
              placeholder="MM/YY"
              value={expiry}
              maxLength={5}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            />

            <label>CVC *</label>
            <input
              type="text"
              placeholder="123"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
            />
          </>
        )}

        <label>Megjegyzés</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Opcionális"
          rows={3}
        />

        {loading ? (
          <div className="paymentLoading">
            {paymentMethod === 'CARD' ? 'Fizetés folyamatban...' : 'Mentés...'}
          </div>
        ) : (
          <button className="payButton" onClick={handleSubmit}>
            {paymentMethod === 'CARD' ? 'Fizetés és rendelés' : 'Megrendelés leadása'}
          </button>
        )}

        <button className="closeButton" onClick={onClose}>
          Mégse
        </button>
      </div>
    </div>
  );
}
