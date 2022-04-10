function Footer() {
    return (
      <div>
          <footer className="bg-dark text-center text-white ">
        {/*Grid container*/}
      <div className="container p-4">
        

       

        {/* Section: Text*/}
        <section className="mb-4">
          <p>
            This WebSite is developed by Group 20
          </p>
        </section>
        {/* Section: Text*/}

        {/* Section: Links*/}
        <section className="">
          {/*Grid row*/}
          <div className="row">
            {/*Grid column*/}
            <div className="col-lg-12 col-md-6 mb-4 mb-md-0">
              <h5 className="text-uppercase">Get to Know Us</h5>

              <ul className="list-unstyled mb-0">
                <li>
                  <a href="#!" className="text-white">About Us</a>
                </li>
               
              </ul>
            </div>
            {/*Grid column*/}

            
      
          </div>
          {/*Grid row*/}
        </section>
        {/* Section: Links*/}
      </div>
      {/* Grid container*/}

      {/* Copyright  {/*style={"background-color"= rgba(0, 0, 0, 0.2)*/}
      <div className="text-center p-3">
        <span>© 2022 Copyright: 
            <a className="text-white" href="/">Bookworm.com</a>
        </span>
      </div>
      {/* Copyright*/}
    </footer>
    {/* Footer*/}
      </div>
    );
  }
  
  export default Footer;
  