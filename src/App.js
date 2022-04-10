import './App.css';
import Main from './Components/Main';
import Cart from './Components/Cart';
import Ebook from './Components/Ebook';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from './Components/Signin';
import Signup from './Components/Signup';
import Layout from './Components/Layout';
import PageNotFound from './Components/PageNotFound';
import ViewEbook from './Components/ViewEbook';
import PurchaseHistory from './Components/PurchaseHistory';
import Lendinglibrary from './Components/Lendinglibrary';
import MyShelf from './Components/MyShelf';
import Packageselector  from './Components/Packageselector';
import ViewProfile from './Components/ViewProfile';
import AdminViewEbook from './Components/AdminViewEbook';
import Upload from './Components/Upload';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="cart" element={<Cart />} />
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
          <Route path="lending-library" element={<Lendinglibrary/> } />
          <Route path="Packageselector" element={<Packageselector />} />
          <Route path="View" element={<ViewProfile/> } />
          <Route path="ebook" element={<Ebook />} />
          <Route path="main" element={<Main />} />
          <Route path="Upload" element={<Upload />} />
          <Route path="AdminViewEbook" element={<AdminViewEbook />} />
          <Route path="view/:id" element={<ViewEbook />} />
          <Route path="purchase-history" element={<PurchaseHistory />} />
          <Route path="my-shelf" element={<MyShelf />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
