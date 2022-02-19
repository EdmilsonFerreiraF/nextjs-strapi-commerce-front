import {
  Button
} from "reactstrap";
import { useContext } from "react"

import GlobalContext from "../../../context/GlobalContext";

const Buy = ({ product }) => {
  const globalContext = useContext(GlobalContext);

  return (
    <Button
      className="col-4 rounded-0"
      color="secondary"
      onClick={() => globalContext.removeItem(product)}
    >
      <i className="bi bi-cart me-1"></i> Buy
    </Button>
  )
}

export default Buy