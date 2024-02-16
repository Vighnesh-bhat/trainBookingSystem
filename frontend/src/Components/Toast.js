import { toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyToast = (id, text, progressColor, top=0, type="default") => {
  toast.info(text, {
    type: type,
    toastId: id,
    position: "top-right",
    theme: "light",
    transition: Slide,
    autoClose: 5000,
    closeButton: false,
    style: {
      fontFamily: "Poppins",
      fontSize: "14px",
      borderRadius: "10px",
      color: "black",
      marginTop: top
    },
    progressStyle: {
      background: progressColor
    }
  });
}

export default MyToast;
