
function Footer() {
  return (
    <div>
      <footer className=" ">
        <footer className="verify-supp-color footer bg-base-200 p-10  text-base-content ">
          <div className=" p-10 font-medium text-white">
            <span className=" pb-10 text-xl text-cyan-500">OUR SERVICES</span>
            <a className="link-hover link pb-2">Veterinary Services</a>
            <a className="link-hover link pb-2">Grooming</a>
            <a className="link-hover link pb-2">DIY Wash</a>
            <a className="link-hover link pb-2">Puppy School</a>
            <a className="link-hover link pb-2">Pet Adoption</a>
            <a className="link-hover link pb-2">Pet Laundry</a>
            <a className="link-hover link pb-2">PET ID Tags</a>
            <a className="link-hover link pb-2">Water Testing</a>
            <a className="link-hover link pb-2">Dog Daycare</a>
            <a className="link-hover link pb-2">Cat Boarding</a>
          </div>
          <div className="p-10 font-medium text-white">
            <span className=" pb-10 text-xl text-cyan-500">
              SHOPPING WITH US
            </span>
            <a className="link-hover link pb-2">Petstock Rewards</a>
            <a className="link-hover link pb-2">Gift Cards</a>
            <a className="link-hover link pb-2">Promotions</a>
            <a className="link-hover link pb-2">Privacy Policy</a>
            <a className="link-hover link pb-2">Terms & Conditions</a>
            <a className="link-hover link pb-2">Reviews</a>
            <a className="link-hover link pb-2">Catalogue</a>
          </div>
          <div className="p-10 font-medium text-white">
            <span className=" pb-10 text-xl text-cyan-500">ABOUT US</span>
            <a className="link-hover link pb-2">About Petstock</a>
            <a className="link-hover link pb-2">Petstock Foundation</a>
            <a className="link-hover link pb-2">Our Partners</a>
            <a className="link-hover link pb-2">Careers</a>
            <a className="link-hover link pb-2">Newsroom</a>
            <a className="link-hover link pb-2">Pet Smarts Blog</a>
            <a className="link-hover link pb-2">At Home with Petstock</a>
            <a className="link-hover link pb-2">Adoption Hub</a>
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
