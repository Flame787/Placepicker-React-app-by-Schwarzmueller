export default function DeleteConfirmation({ onConfirm, onCancel }) {

// Adding a timer that Modal with question dissapears after 5 sec, 
// and selected location automatically get's deleted from saved locations:
// setTimeout has 2 arguments: a function, and a duration in miliseconds

// If <DeleteConfirmation> is always part of the DOM (always rendering), 
// then the timer is always activated whenever the App component renders for the 1st time
setTimeout(() => {
  onConfirm();   // calling the same function, as if we have confirmed the deleting of the selected location
}, 5000);

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
    </div>
  );
}
