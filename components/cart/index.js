import React, { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Card, CardBody, CardTitle, Badge } from "reactstrap";

import GlobalContext from "../../context/GlobalContext";
import ItemList from "./itemList";


function Cart() {
  const globalContext = useContext(GlobalContext);
  const router = useRouter();

  const { cart, isAuthenticated } = globalContext;

  return (
    <div>
      <Card style={{ padding: "10px 5px" }} className="cart">
        <CardTitle style={{ margin: 10 }}>Your Order:</CardTitle>
        <hr />
        <CardBody style={{ padding: 10 }}>
          <div style={{ marginBottom: 6 }}>
            <small>Items:</small>
          </div>
          <div>
          <ItemList cart={cart} />
            {isAuthenticated ? (
              cart.items.length > 0 ? (
                <div>
                  <Badge style={{ width: 200, padding: 10 }} color="light">
                    <h5 style={{ fontWeight: 100, color: "gray" }}>Total:</h5>
                    <h3>${globalContext.cart.total.toFixed(2)}</h3>
                  </Badge>
                  {router.pathname === "/restaurants" && (
                    <div
                      style={{
                        marginTop: 10,
                        marginRight: 10,
                      }}
                    >
                      <Link href="/checkout">
                        <Button style={{ width: "100%" }} color="primary">
                          <a>Order</a>
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {router.pathname === "/checkout" && (
                    <small
                      style={{ color: "blue" }}
                      onClick={() => window.history.back()}
                    >
                      back to products
                    </small>
                  )}
                </>
              )
            ) : (
              <h5>Login to Order</h5>
            )}
          </div>
        </CardBody>
      </Card>
      <style jsx>{`
        #item-price {
          font-size: 1.3em;
          color: rgba(97, 97, 97, 1);
        }
        #item-quantity {
          font-size: 0.95em;
          padding-bottom: 4px;
          color: rgba(158, 158, 158, 1);
        }
        #item-name {
          font-size: 1.3em;
          color: rgba(97, 97, 97, 1);
        }
      `}</style>
    </div>
  );
}

export default Cart;