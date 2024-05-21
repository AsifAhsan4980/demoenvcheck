import React,{Fragment} from "react";
import LoginLayout from "../layout/LoginLayout";
import AllProducts from "../components/product/AllProducts";

const Home = () => {
  return (
      <Fragment>
      <LoginLayout title={'Home'}>
          <AllProducts/>
      </LoginLayout>
      </Fragment>
  )
}

export default Home