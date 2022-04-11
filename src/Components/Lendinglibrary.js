import {
  Card,
  Button, Modal
} from "react-bootstrap";
import React, { Component } from 'react';
import {defaultPkgs} from '../assets/default-packages';


class Lendinglibrary extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ebooks: [],
      searchTerm: "",
      selectedBook: "",
      packages: [],
      showPackageModal: false,
      showCreatePackageModal: false,
      selectedPackage: "",
      defaultPackages: defaultPkgs
    }
    console.log(this.state)
  }

  componentDidMount() {
    this.fetchBooks();
  }

  fetchBooks() {
    let url = '/ebooks/'
    let userId = localStorage.getItem('userId')
    if (userId)
      url = '/ebooks/fetchBooks?userId=' + userId 
    fetch(process.env.REACT_APP_BACKEND_EBOOK_URL + url)
        .then(res => res.json())
        .then((result) => { this.setState({ebooks: 
          result.filter((val) => {
            return val.actions.includes("lend")
          })
          ?.filter((val) => {
            if (this.state.searchTerm === "") {
              return true;
            } else if (
              val.booktitle.toLowerCase().includes(this.state.searchTerm.toLowerCase())
            ) {
              return true;
            }
            return false;
          })
          ?.map((ebook) => (
          <div className="col" key={ebook.id}>
            <Card style={{ width: '18rem' }}>
              <a className="viewlink" href={"/view/" + ebook.id}>
                <Card.Img variant="top" width="100%" height="400px" src={process.env.REACT_APP_BACKEND_EBOOK_URL + "/ebooks/" + ebook.image} />
              </a>
              <Card.Body>
                <a className="viewlink" href={"/view/" + ebook.id}>
                  <Card.Title>{ebook.booktitle}</Card.Title>
                  <Card.Text>
                    <span className="authorSpan">&ensp;by <em>{ebook.author}</em></span><br/>
                    <span className="text-danger">₹{ebook.price}</span>
                  </Card.Text>
                </a>
                <Button className="col" onClick={this.packageModel.bind(this, ebook.id)} style={{marginTop: "5%",marginRight:"1rem", width: '100%'}} variant="secondary">Lend</Button>
              </Card.Body>
            </Card>
          </div>
          ))
         })}
    );
  }

  // quick search
  onFilterTextChange(event) {
    this.setState({searchTerm :event.target.value});
  };

  onPackageSelectionChange(event) {
    this.setState({selectedPackage: event.target.value});
  }

  updatePackageSelection(packageId) {
    this.setState({selectedPackage: packageId});
  }

  packageModel(bookId) {
    let userId = localStorage.getItem('userId');
    if (userId == null) {
      alert("Kindly login first.");
    } else {
      fetch(process.env.REACT_APP_BACKEND_EBOOK_URL + "/package/fetchByUserId?userId=" + userId)
          .then(res => res.json())
          .then((pkgs) => {
            this.setState({showPackageModal:true,
              selectedBook: bookId,
              packages: pkgs,
              selectedPackage: ''
            });
          });
    }
  }

  createPackageModal() {
    let packageNames = this.state.packages.map((pkg)=> {return pkg.packageName});
    this.setState({
      showPackageModal: false,
      showCreatePackageModal: true,
      selectedPackage: "",
      defaultPackages: defaultPkgs.filter((defaultPkg) => {
        return !packageNames.includes(defaultPkg.packageName)
      })
    })
  }

  createPackage = () => {
    const pkg = this.state.defaultPackages.filter((pkg) => {return pkg.packageName === this.state.selectedPackage})[0];
    pkg.endDate = new Date()
    pkg.endDate.setDate(pkg.endDate.getDate() + parseInt(pkg.noOfDays));
    pkg.bookId = this.state.selectedBook
    pkg.noOfBooks -= 1
    pkg.userId = localStorage.getItem('userId');
    fetch(process.env.REACT_APP_BACKEND_EBOOK_URL + "/package/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pkg)
    }).then(data=> 
      data.json()
    ).then(
      (data) => {
        console.log(data);
        if (data !== undefined && data !== null && (data.error === undefined || data.error === null)) {
            alert("Package created and eBook lent successfully");
        } else
          alert("Package creation faild: " + data.error)
        this.fetchBooks();
        this.setState({showCreatePackageModal: false});
      }
    )
    .catch((err) => {
      alert("Failed to create package");
      console.log(err);
    });
  }

  lendBook() {
    if (this.state.selectedPackage === undefined) {
      alert("No Package is selected")
    }
    let pkg = this.state.packages.filter((pack) => {return pack.packageId === this.state.selectedPackage})[0]
    let lendObject = {
      userId: localStorage.getItem('userId'),
      bookId: this.state.selectedBook,
      packageId: pkg.packageId,
      'endDate': pkg.endDate
    }
    console.log('lend', lendObject)
    this.setState({showPackageModal: false});
    fetch(process.env.REACT_APP_BACKEND_EBOOK_URL + "/lend/lendBookAndUpdatePackage", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(lendObject)
    }).then(data=> 
      data.json()
    ).then(
      (data) => {
        console.log(data);
        if (data !== undefined && data !== null && (data.error === undefined || data.error === null)) {
            alert("eBook lent successfully");
        } else
          alert("Failed to lent ebook: " + data.error)
        this.fetchBooks();
      }
    )
    .catch((err) => {
      alert("Failed to lent eBook");
      console.log(err);
    });
  }

  render() {
    return (
    <div className="container" style={{marginBottom:"3rem" }}>
      <input className="mt-3 mb-3 form-control me-2" onChange={(e)=>this.onFilterTextChange.bind(this, e)} type="search" placeholder="Search" aria-label="Search" />
      <div className="row">
        {
        this.state.ebooks.length > 0 ?
          this.state.ebooks
        : <span>No eBooks available</span>
        } 
      </div>
      <Modal show={this.state.showPackageModal} onHide={()=> {this.setState({showPackageModal: false})}}>
        <Modal.Header closeButton>
          <Modal.Title>Available Packages</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            {
              (this.state.packages?.length > 0) ? this.state.packages.map((pkg)=> (
                <div key={pkg.packageId} className="col" onClick={this.updatePackageSelection.bind(this, pkg.packageId)}>
                  <Card style={{ width: '15rem' }}>
                  <Card.Body>
                      <input type="radio" value={pkg.packageId}
                      checked={this.state.selectedPackage === pkg.packageId}
                      onChange={this.onPackageSelectionChange.bind(this)} />
                      
                      <Card.Title>{pkg.packageName}</Card.Title>
                      <Card.Text>
                        <span># of books: {pkg.noOfBooks}</span><br/>
                        <span># of days left: {new Date(pkg.endDate).getDate() - new Date().getDate()}</span><br/>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              ))
              : <div>
                </div>
            }
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.createPackageModal.bind(this)}>Buy package and Lend</Button>
          <Button variant="primary" onClick={this.lendBook.bind(this)}>Lend</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={this.state.showCreatePackageModal} onHide={() => {this.setState({showCreatePackageModal: false})}}>
        <Modal.Header closeButton>
          <Modal.Title>Buy Package</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container container-fluid row">
            {
              this.state.defaultPackages.map((pkg)=> {
                return <Card style={{ width: '15rem !important' }} className="col" onClick={this.updatePackageSelection.bind(this, pkg.packageName)}>
                  <Card.Body>
                    <input type="radio" value={pkg.packageName}
                    checked={this.state.selectedPackage === pkg.packageName}
                    onChange={this.onPackageSelectionChange.bind(this)} />
                    <Card.Title>{pkg.packageName}</Card.Title>
                    <Card.Text>
                      <span># of books: {pkg.noOfBooks}</span><br/>
                      <span># of days: {pkg.noOfDays}</span><br/>
                      <span>Cost: {pkg.lendAmount}</span>
                    </Card.Text>
                  </Card.Body>
                </Card>
              })
            }
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=> {this.setState({showCreatePackageModal: false})}}>Cancel</Button>
          <Button variant="primary" onClick={this.createPackage.bind(this)}>Buy Package and Lend</Button>
        </Modal.Footer>
      </Modal>
    </div>
    )
  }
}

export default Lendinglibrary;