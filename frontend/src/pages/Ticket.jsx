import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { closeTicket, getTicket } from "../features/tickets/ticketSlice";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { getNotes } from "../features/notes/noteSlice";
import NoteItem from "../components/NoteItem";
import { FaPlus } from "react-icons/fa";

const customStyles = {
  content: {
    width: "600px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%,-50%)",
    position: "relative",
  },
};

Modal.setAppElement("#root");

const Ticket = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const { isError, isLoading, ticket, message } = useSelector(
    (state) => state.ticket
  );

  const { isLoading: notesIsLoading, notes } = useSelector(
    (state) => state.note
  );
  const { ticketId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    dispatch(getTicket(ticketId));
    dispatch(getNotes(ticketId));
  }, [isError, message, dispatch, ticketId]);

  //Close ticket
  const onCloseTicket = () => {
    dispatch(closeTicket(ticketId));
    toast.success("Ticket Closed");
    navigate("/tickets");
  };

  //Create Note
  const onNoteSubmit = (e) => {
    e.preventDefault();

    closeModal();
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  if (isLoading || notesIsLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h3>Something Went Wrong</h3>;
  }

  return (
    <div className="ticket-page">
      <header className="ticket-header">
        <BackButton url="/" />
        <h2>
          Ticket ID: {ticket._id}
          <span className={`status status-${ticket.status}`}>
            {ticket.status}
          </span>
        </h2>
        <h3>
          Date Submitted: {new Date(ticket.createdAt).toLocaleString("en-US")}
        </h3>
        <h3>Product: {ticket.product}</h3>
        <hr />
        <div className="ticket-desc">
          <h3>Description of Issue</h3>
          <p>{ticket.description}</p>
        </div>
        <h2>Notes</h2>
      </header>
      {ticket.status !== "closed" && (
        <button className="btn " onClick={openModal}>
          <FaPlus />
          Add Note
        </button>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add Note"
      >
        <h2>Add Note</h2>
        <button className="btn-close" onClick={closeModal}>
          X
        </button>
        <form onSubmit={onNoteSubmit}>
          <div className="form-group">
            <textarea
              name="noteText"
              id="noteText"
              className="form-control"
              placeholder="Note Text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <button type="submit" className="btn">
              Submit
            </button>
          </div>
        </form>
      </Modal>
      {notes.map((note) => (
        <NoteItem key={note._id} note={note} />
      ))}
      {ticket.status !== "closed" && (
        <button className="btn btn-block btn-danger" onClick={onCloseTicket}>
          Close Ticket
        </button>
      )}
    </div>
  );
};

export default Ticket;
