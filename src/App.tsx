import './App.css';
import Modal from './components/Modal/Modal';
import { useState } from 'react';
import SegmentForm from './components/Segment/SegmentForm';

function App() {
  const [openModal, setOpenModal] = useState(false);

  const handleClose = () => {
    setOpenModal(false);
  };
  return (
    <>
      <div className="navbar">
        <img src="/customerlabs-logo.png" alt="CustomerLabs" height={60} />
      </div>
      <main>
        <button onClick={() => setOpenModal(true)}>Save Segment</button>
      </main>
      <Modal
        handleClose={handleClose}
        heading="Saving Segment"
        openModal={openModal}
      >
        <SegmentForm handleClose={handleClose} />
      </Modal>
    </>
  );
}

export default App;
