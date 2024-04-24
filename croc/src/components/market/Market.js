import React, { useEffect, useState, useRef } from "react";
import ItemCard from "../../components/itemCard/ItemCard";
import "./Market.css";

import { CurrentUser } from "../../apis/UserApi";

import { Card, CardGroup } from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";
import { Link, Navigate } from "react-router-dom";
import { Input, Button } from "@chakra-ui/react";
import { GetAllOff } from "../../apis/OfferApi";
import Footer from "../screens/Footer/Footer";
import Brand from "../screens/brand/Brand";

const Market = () => {
  const [listdev, setListdev] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [user, setUser] = useState({});
  const[avg, setAvg] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const isDevs = async () => {
    const AllDev = await GetAllOff();

    setListdev(AllDev);
  };
  const isUser = async () => {
    const AllUser = await CurrentUser();

    setUser(AllUser.data.user);
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value.toLowerCase());
    const searchFruits = listdev.filter((el) => {
      return el.prjectname.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setFilteredResults(searchFruits);
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = listdev
    ?.filter((e) => e._id !== user._id)
    .slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleBrandFilter = (e) => {
    const selectedBrand = e.target.value;
    if (selectedBrand === "") {
      setFilteredResults([]);
    } else {
      const filteredByBrand = listdev.filter(
        (item) => item.brand === selectedBrand
      );
      setFilteredResults(filteredByBrand);
    }
  };

// const avrageRateHandler=()=>{
//   let sumRates=0;
//   const avgRates = listdev.filter((item) => );
  
// }

const calculateAverageRating = (item) => {
  if (!item || !item.rating || !Array.isArray(item.rating) || item.rating.length === 0) {
    return 0; // Return 0 if the item or its rating array is invalid or empty
  }

  // Calculate the sum of all ratings
  const totalRating = item.rating.reduce((sum, rating) => sum + rating.rate, 0);

  // Calculate the average rating
  const averageRating = totalRating / item.rating.length;

  return averageRating;
};

// Calculate average ratings for all items in listdev
const averageRatings = listdev.map(calculateAverageRating);

console.log("Average Ratings:", averageRatings);


// Filter products based on average rating within a range
const filterByRating = (range) => {
  const filteredByRating = listdev.filter((item) => {
    const averageRating = calculateAverageRating(item);
    return averageRating >= range.min && averageRating <= range.max;
  });
  setFilteredResults(filteredByRating);
};

// Define ranges
// Define ranges
// Define ranges
const ratingRanges = [
  { min: 1, max: 1 },
  { min: 2, max: 2 },
  { min: 3, max: 3 },
  { min: 4, max: 4 },
  { min: 5, max: 5 },
];

// Display buttons for each rating range
// Display dropdown selector for rating range
const ratingSelector = (
  <input
    type="range"
    min="0"
    max={ratingRanges.length - 1}
    onChange={(e) => filterByRating(ratingRanges[e.target.value])}
  />
);

// Use the ratingSelector to display the filter dropdown







  const currentItemsToDisplay =
    filteredResults.length > 0 ? filteredResults : currentItems;

  const [selectedPrice, setSelectedPrice] = useState(0);

  const handlePriceFilter = (e) => {
    const price = parseInt(e.target.value);
    setSelectedPrice(price);
    const filteredByPrice = listdev.filter((item) => item.budget >= price);
    if (filteredByPrice.length === 0) {
      setFilteredResults([]);
    } else {
      setFilteredResults(filteredByPrice);
    }
  };
console.log(listdev);
  useEffect(() => {
    isDevs();
    isUser();
  }, []);
  return (
    <div id="cmnt mb-5">
      <section className="sakura">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 mt-5">
              <h1 className="display-4 fw-bolder  text-center text-white"></h1>

              <p className="moon  text-center  mb-5 ">
                <div class="container market lead text-center fs-4 ">
                  <h2 className="mar">MARKET</h2>
                  <h2 className="mar">MARKET</h2>
                </div>
              </p>

              <div className="buttons d-flex justify-content-center">
                <div className="">
                  <div>
                    <div className="btnn rounded-pill ">
                      <Input
                        icon="search"
                        placeholder="Search..."
                        onChange={handleSearch}
                        value={searchInput}
                      />
                    </div>
                  </div>
                  <CardGroup
                    className="cardres "
                    itemsPerRow={3}
                    style={{ marginTop: 20 }}
                  >
                    {searchInput &&
                      filteredResults &&
                      filteredResults.map((item) => {
                        return (
                          <Card>
                            <Link to={`/dev/${item._id}`} state={{ dev: item }}>
                              <CardHeader>{item.prjectname}</CardHeader>
                            </Link>
                          </Card>
                        );
                      })}
                  </CardGroup>
                  {/* <a className="btn btn-light" href="#about">
                    Get Started
                  </a> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="d-flex justify-content-center mt-5 bg-transparent">
        <Brand/>
      </div>
     

      <div className="container py-4">
        <div className="row">
          <div className="col-12 background-container">
            <h1 className="display-6 fw-bolder text-left">Products </h1>

            <br />
            <hr />
          </div>
        </div>
      </div>
      <section>
        <div className="container my-2 py-2">
          <div className="row">
            <div className="container bbg-white shadow col-md-3">
              <div className=" ctr">
                <p className="free mb-3">
                  <b>Shop by Brand</b>{" "}
                  <i className="fa fa-arrow-down" aria-hidden="true"></i>
                </p>
                <label htmlFor="category">Brands:</label>
                <select id="category" onChange={handleBrandFilter}>
                  <option value="">All</option>
                  <option value="Geant">GEANT</option>
                  <option value="Monoprix">MONOPRIX</option>
                  <option value="Carrefour">CARREFOUR</option>
                  <option value="Mg">MG</option>
                  {/* Add more options as needed */}
                </select>
                <br />
                <p className="mb-3 mt-3">
                  <b>Sort by Price</b>{" "}
                  <i className="fa fa-arrow-down" aria-hidden="true"></i>
                </p>
                <label htmlFor="price">Price Range:</label>
                <br />
                <input
                  type="range"
                  id="price"
                  min="0"
                  max="1000"
                  onChange={handlePriceFilter}
                />
                <div>Selected Price Range: {selectedPrice}TND</div>
                <p className="mb-3 mt-3">
                  <b>Sort by Rate</b>{" "}
                  <i className="fa fa-arrow-down" aria-hidden="true"></i>
                </p>
                <div className="rating-filters">
      {ratingSelector}
    </div>
              </div>
            </div>
            <div className="col-md-9">
              <div className="row">
                <div className="row">
                  {selectedPrice > 0 && filteredResults.length === 0 ? (
                    <p>No products found within the selected price range.</p>
                  ) : currentItemsToDisplay.length === 0 ? (
                    <p>No products found for the selected brand.</p>
                  ) : (
                    currentItemsToDisplay.map((el) => (
                      <div key={el._id} className="col-md-4 mb-4">
                        <ItemCard dev={el} use={user._id} />
                      </div>
                    ))
                  )}
                </div>
              </div>
              {/* Pagination */}
              <div className="d-flex justify-content-center mb-5">
                <ul className="pagination">
                  {Array.from({
                    length: Math.ceil(listdev.length / itemsPerPage),
                  }).map((_, index) => (
                    <li key={index} className="page-item">
                      <Button
                        className="page-link"
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Market;
