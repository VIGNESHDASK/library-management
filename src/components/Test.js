import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const Test = () => {
  const [weight, setWeight] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [currentPrize, setCurrentPrize] = useState('');
  const [Gprize, setGprize] = useState(0);
  const [GMprize, setGMprize] = useState(0);
  const [GMTprize, setGMTprize] = useState(0);
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const weightNum = parseFloat(weight);
    const interestRateNum = parseFloat(interestRate);
    const currentPrizeNum = parseFloat(currentPrize);

    const Gprize = Math.ceil(weightNum * currentPrizeNum);
    const GMprize = Math.ceil(Gprize + (Gprize * interestRateNum / 100));
    const GMTprize =  Math.ceil(GMprize + (GMprize * 3 / 100));

    setGprize(Gprize);
    setGMprize(GMprize);
    setGMTprize(GMTprize);
  };

  return (
    <>
    

      <Form onSubmit={handleSubmit} className="m-3">
        <Form.Group controlId="formWeight" className="mb-3">
          <Form.Label>Weight</Form.Label>
          <Form.Control type="text" placeholder="Enter weight" value={weight} onChange={e => setWeight(e.target.value)} className="mt-2 mb-3" />
        </Form.Group>

        <Form.Group controlId="formInterestRate" className="mb-3">
          <Form.Label>Making Rate</Form.Label>
          <Form.Control type="text" placeholder="Enter Making rate" value={interestRate} onChange={e => setInterestRate(e.target.value)} className="mt-2 mb-3" />
        </Form.Group>

        <Form.Group controlId="formCurrentPrize" className="mb-3">
          <Form.Label>Prize (gram.)</Form.Label>
          <Form.Control type="text" placeholder="Current Prize" value={currentPrize} onChange={e => setCurrentPrize(e.target.value)} className="mt-2 mb-3" />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Calculate
        </Button>
      </Form>

      G rate : {Gprize} || 
      GM rate : {GMprize} || 
      GMT rate : {GMTprize}




      
    </>
  );
};

export default Test;