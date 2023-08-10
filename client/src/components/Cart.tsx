import React, {useState} from 'react'
function Cart() {

    const [cart, setCart] = useState(null)

    return (
   <div>
       {cart}
   </div>
  );
}

export default Cart;
