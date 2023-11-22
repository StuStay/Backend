import axios from "axios";
import fetch from 'node-fetch';


export async function Add(req, res) {
    const url = "https://developers.flouci.com/api/generate_payment";

    const payload = {
        "app_token": "d7854198-288a-48c1-9375-12a1621c1c91",
        "app_secret": "9822a0dd-0d90-4577-9013-9862526470b1",
        "amount": req.body.amount,
        "accept_card": "true",
        "session_timeout_secs": 1200,
        "success_link": "http://localhost:3000/success",
        "fail_link": "http://localhost:3000/fail",
        "developer_tracking_id": "17f315c1-ff69-4435-b402-c1f6876876b1"
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error data:', errorData);

            if (errorData.fieldErrors && errorData.fieldErrors.length > 0) {
                errorData.fieldErrors.forEach(fieldError => {
                    console.error(`Field: ${fieldError.field}, Message: ${fieldError.message}`);
                });
            }

            res.status(response.status).json({ error: 'Internal Server Error' });
            return;
        }

        const result = await response.json();
        res.json(result);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



export async function Verify(req, res) {
    const payment_id = req.params.id;
    const response = await axios.get(`https://developers.flouci.com/api/verify_payment/${payment_id}`, {
      headers: {
        'Content-Type': 'application/json',
        'apppublic': 'd7854198-288a-48c1-9375-12a1621c1c91',
        'appsecret': process.env.FLOUCI_SECRET,
      },
    });

    if (response.status === 200) {

      res.send(response.data);
    } else {
      res.status(500).send({ error: 'Payment verification failed' });
    }
  }