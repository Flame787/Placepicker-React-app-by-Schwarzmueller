// import { forwardRef, useImperativeHandle, useRef } from "react";
import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

// const Modal = forwardRef(function Modal({ children }, ref) {
function Modal ({ open, children, onClose }) {
  // no ref is needed anymore, if not using useImperativeHandle-hook and forwardRef
  // instead, adding a new prop: 'open'

  const dialog = useRef();

  useEffect (() => {
    if (open){   // if value of open is truethy:
      dialog.current.showModal()
    } else {     // if value of open is falsey:
      dialog.current.close()
    }
  }, [open]);
// value of 'open' must be dependency - whenever it changes, the whole code for this sideeffect will be run


  /* exposing 2 methods to the outside code: open- and close- function (for <dialog>-element; Modal):
  (but we will comment this out now, to try another approach):  */
  // useImperativeHandle(ref, () => {
  //   return {
  //     open: () => {
  //       dialog.current.showModal();
  //     },
  //     close: () => {
  //       dialog.current.close();
  //     },
  //   };
  // });

  return createPortal(
    // <dialog className="modal" ref={dialog}>
      <dialog className="modal" ref={dialog} onClose={onClose}>
        {/* added new prop for dialog-element: 'open' */}
      {/* {children} */}
      {open ? children : null}
      {/* conditionally redering children - if open is true, otherwise rendering nothing (null),
      so that the timer in DeleteConfirmation-component is not set instantly each time when App re-renders*/}
    </dialog>,
    document.getElementById("modal")
  );
// });
};

export default Modal;
