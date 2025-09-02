
function Footer() {
  return (
    <div>
      <footer className="mt-[5%]">
        <footer className="verify-supp-color footer bg-base-200 p-10  text-base-content ">
          <div className=" p-10 font-medium text-white">
            <span className=" pb-10 text-xl text-cyan-500">ABOUT</span>
            <a className="link-hover link pb-2">About Us</a>
            <a className="link-hover link pb-2">Store Reviews</a>
            <a className="link-hover link pb-2">Rewards Program</a>
            <a className="link-hover link pb-2">Affiliate Program</a>
            <a className="link-hover link pb-2">We Give Back</a>
            {/*<span className=" pb-10 text-xl text-cyan-500">OUR SERVICES</span>*/}
            {/*<a className="link-hover link pb-2">Veterinary Services</a>*/}
            {/*<a className="link-hover link pb-2">Grooming</a>*/}
            {/*<a className="link-hover link pb-2">DIY Wash</a>*/}
            {/*<a className="link-hover link pb-2">Puppy School</a>*/}
            {/*<a className="link-hover link pb-2">Pet Adoption</a>*/}
            {/*<a className="link-hover link pb-2">Pet Laundry</a>*/}
            {/*<a className="link-hover link pb-2">PET ID Tags</a>*/}
            {/*<a className="link-hover link pb-2">Water Testing</a>*/}
            {/*<a className="link-hover link pb-2">Dog Daycare</a>*/}
            {/*<a className="link-hover link pb-2">Cat Boarding</a>*/}
          </div>
          <div className="p-10 font-medium text-white">
            <span className=" pb-10 text-xl text-cyan-500">COMPANY</span>
            <a className="link-hover link pb-2">Corporate</a>
            <a className="link-hover link pb-2">Press</a>
            <a className="link-hover link pb-2">Partner with VerifySupp</a>

            {/*<span className=" pb-10 text-xl text-cyan-500">SHOPPING WITH US</span>*/}
            {/*<a className="link-hover link pb-2">Petstock Rewards</a>*/}
            {/*<a className="link-hover link pb-2">Gift Cards</a>*/}
            {/*<a className="link-hover link pb-2">Promotions</a>*/}
            {/*<a className="link-hover link pb-2">Privacy Policy</a>*/}
            {/*<a className="link-hover link pb-2">Terms & Conditions</a>*/}
            {/*<a className="link-hover link pb-2">Reviews</a>*/}
            {/*<a className="link-hover link pb-2">Catalogue</a>*/}
          </div>
          <div className="p-10 font-medium text-white">
            <span className=" pb-10 text-xl text-cyan-500">CUSTOMER SERVICE</span>
            <a className="link-hover link pb-2">Contact Us</a>
            <a className="link-hover link pb-2">Suggest a Product</a>
            <a className="link-hover link pb-2">Order Status</a>
            <a className="link-hover link pb-2">Shipping</a>
            <a className="link-hover link pb-2">Communication Preferences</a>

          </div>
          <div className="p-10 text-white">
            <span className="pb-10 text-xl text-cyan-500">
              JOIN OUR NEWSLETTER!
            </span>
            <div className="form-control w-80">
              <label className="label ">
                <span className="label-text text-white">
                  Enter your email address
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="username@site.com"
                  className="input input-bordered w-full pr-16 text-black"
                />
                <button className="btn btn-primary absolute right-0 top-0 rounded-l-none">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </footer>
      </footer>
    </div>
  );
}

export default Footer;
