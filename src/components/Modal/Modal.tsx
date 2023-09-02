import { ReactNode } from 'react';
import styles from './Modal.module.css';
import { CSSTransition } from 'react-transition-group';

export type ModalProps = {
  children: ReactNode;
  heading: string;
  handleClose: () => void;
  openModal: boolean;
};

const Modal = ({ children, heading, handleClose, openModal }: ModalProps) => {
  return (
    <>
      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={openModal}
        timeout={{ enter: 500, exit: 500 }}
        classNames={{
          enterActive: styles['modal-enter-active'],
          exitActive: styles['modal-exit-active'],
        }}
      >
        <div className={styles.modal} onClick={handleClose}></div>
      </CSSTransition>
      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={openModal}
        timeout={{ enter: 500, exit: 500 }}
        classNames={{
          enterActive: styles['modal-anim-enter-active'],
          exitActive: styles['modal-anim-exit-active'],
        }}
      >
        <section className={styles['modal-main']}>
          <div className={styles['modal-header']}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1.2em"
              viewBox="0 0 320 512"
              onClick={handleClose}
            >
              <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
            </svg>
            <h2>{heading}</h2>
          </div>
          <div className={styles['modal-body']}>{children}</div>
        </section>
      </CSSTransition>
    </>
  );
};

export default Modal;
