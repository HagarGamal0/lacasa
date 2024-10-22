import React, { useEffect, useRef, useState } from "react";
import API from "../../helpers/API/API";
import dynamic from "next/dynamic";
import ReactPaginate from "react-responsive-pagination";
import { useRouter } from "next/router";
import { Col, Container } from "reactstrap";
import PostLoader from "../../components/common/PostLoader";
import Image from "next/image";

import {
  Box,
  Avatar,
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Checkbox,
  AccordionSummary,
  AccordionDetails,
  Accordion,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import Category from "../shop/common/category";
import TopCategory from "../shop/common/topCategory";

const CommonLayout = dynamic(() =>
  import("../../components/shop/common-layout")
);

const Professionals = () => {
  const mockData = {
    data: [
      // {
      //   id: 1,
      //   name: "John Doe",
      //   avatar: "https://esorus.com/uploads/2022/02/02/interior-designer/image/30117.png",
      //   job_title: "Graphic Designer",
      //   bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      //   categories: [{ id: 1, name: "Category 1" }, { id: 2, name: "Category 2" }],
      //   projects: [
      //     {
      //       id: 1,
      //       gallery: [{ url: "https://esorus.com/uploads/2022/07/20/interior-designer-project/image/thumb/s-al-nashar-private-villa-33392.jpeg" }, { url: "https://esorus.com/uploads/2022/07/20/interior-designer-project/image/thumb/s-al-nashar-private-villa-33392.jpeg" }, { url: "https://esorus.com/uploads/2022/07/20/interior-designer-project/image/thumb/s-al-nashar-private-villa-33392.jpeg" }],
      //     },
      //   ],
      // },
      // {
      //   id: 1,
      //   name: "John Doe",
      //   avatar: "https://esorus.com/uploads/2022/02/02/interior-designer/image/30117.png",
      //   job_title: "Graphic Designer",
      //   bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      //   categories: [{ id: 1, name: "Category 1" }, { id: 2, name: "Category 2" }],
      //   projects: [
      //     {
      //       id: 1,
      //       gallery: [{ url: "https://esorus.com/uploads/2022/07/20/interior-designer-project/image/thumb/s-al-nashar-private-villa-33392.jpeg" }, { url: "https://esorus.com/uploads/2022/07/20/interior-designer-project/image/thumb/s-al-nashar-private-villa-33392.jpeg" }, { url: "https://esorus.com/uploads/2022/07/20/interior-designer-project/image/thumb/s-al-nashar-private-villa-33392.jpeg" }],
      //     },
      //   ],
      // },
      // {
      //   id: 1,
      //   name: "John Doe",
      //   avatar: "https://esorus.com/uploads/2022/02/02/interior-designer/image/30117.png",
      //   job_title: "Graphic Designer",
      //   bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      //   categories: [{ id: 1, name: "Category 1" }, { id: 2, name: "Category 2" }],
      //   projects: [
      //     {
      //       id: 1,
      //       gallery: [{ url: "https://esorus.com/uploads/2022/07/20/interior-designer-project/image/thumb/s-al-nashar-private-villa-33392.jpeg" }, { url: "https://esorus.com/uploads/2022/07/20/interior-designer-project/image/thumb/s-al-nashar-private-villa-33392.jpeg" }, { url: "https://esorus.com/uploads/2022/07/20/interior-designer-project/image/thumb/s-al-nashar-private-villa-33392.jpeg" }],
      //     },
      //   ],
      // },
      // {
      //   id: 1,
      //   name: "John Doe",
      //   avatar: "https://esorus.com/uploads/2022/02/02/interior-designer/image/30117.png",
      //   job_title: "Graphic Designer",
      //   bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      //   categories: [{ id: 1, name: "Category 1" }, { id: 2, name: "Category 2" }],
      //   projects: [
      //     {
      //       id: 1,
      //       gallery: [{ url: "https://esorus.com/uploads/2022/07/20/interior-designer-project/image/thumb/s-al-nashar-private-villa-33392.jpeg" }, { url: "https://esorus.com/uploads/2022/07/20/interior-designer-project/image/thumb/s-al-nashar-private-villa-33392.jpeg" }, { url: "https://esorus.com/uploads/2022/07/20/interior-designer-project/image/thumb/s-al-nashar-private-villa-33392.jpeg" }],
      //     },
      //   ],
      // },
      // {
      //   id: 1,
      //   name: "John Doe",
      //   avatar: "https://esorus.com/uploads/2022/02/02/interior-designer/image/30117.png",
      //   job_title: "Graphic Designer",
      //   bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      //   categories: [{ id: 1, name: "Category 1" }, { id: 2, name: "Category 2" }],
      //   projects: [
      //     {
      //       id: 1,
      //       gallery: [{ url: "https://esorus.com/uploads/2022/07/20/interior-designer-project/image/thumb/s-al-nashar-private-villa-33392.jpeg" }, { url: "https://esorus.com/uploads/2022/07/20/interior-designer-project/image/thumb/s-al-nashar-private-villa-33392.jpeg" }, { url: "https://esorus.com/uploads/2022/07/20/interior-designer-project/image/thumb/s-al-nashar-private-villa-33392.jpeg" }],
      //     },
      //   ],
      // },
    ],
    meta: {
      total_items: 100, // Total number of items
      current_page: 1, // Current page number
      last_page: 1, // Total number of pages
    }
  };

  const router = useRouter();
  const [data, setData] = useState({ data: [] });
  const [categories, setCategories] = useState({ data: null }); //have all object
  const [page, setPage] = useState(1);
  const [expand, setExpand] = useState(true);
  const [checked, setChecked] = React.useState([]);
  const [sidebarView, setSidebarView] = useState(false);
  const [catsProf, setCatsProf] = useState(); // have only slug & name
  const [loading, setloading] = useState(false);
  const [empty, setempty] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [appliedFilter, setAppliedFilter] = useState({});
  const [cities,setCities]=useState();
  const [range, setRange] = useState({});



  useEffect(() => {
    if (router.query?.category) setChecked([parseInt(router.query.category)]);
  }, [categories]);

    useEffect(() => {
        API.readAll(`/designers/filter-data`)
        .then(async (response) => {
            const rmax = response.data?.max_exp;
            setRange({min:0,max:rmax});
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);
// This to get all categories
  // useEffect(() => {
  //   setloading(true);
  //   API.readAll(`/designers/categories`)
  //     .then((res) => {
  //       setloading(false);
  //       setCategories(res);
  //     })
  //     .catch((err) => {
  //       setloading(false);
  //     });
  // }, []);


// This to reload page content depend on filter options

  useEffect(() => {
    let req_page = router.query.page == undefined ? '': '&page='+router.query.page ;
    let req_search=router.query.search == undefined ? '': '&find[name]='+router.query.search;
    let req_cat_id= router.query.category == undefined ? '' : '&find[id]='+router.query.category;
    const q_Range= router.query.range?.split(',');
    let req_range_min=q_Range == undefined ? '':'&min_exp='+q_Range[0];
    let req_range_max=q_Range == undefined ? '':'&max_exp='+q_Range[1];
    let req_city= router.query.city == undefined ? '':'&city='+router.query.city;
    let req_area= router.query.area == undefined ? '':'&area='+router.query.area;
    setloading(true);
    setempty(true);
    API.readAll(
      `/designers?status=2${req_page}${req_search}${req_cat_id}${req_range_min}${req_range_max}${req_city}${req_area}`
    )
      .then((res) => {
        setData(res);
      })
      .then((res) => {
        setloading(false);
      })
      .catch((err) => {
        setloading(false);
      });
  }, [router.query.page,router.query.search, router.query.category,router.query.range,router.query.city,router.query.area]);

  const handlePageChange = (e) => {
    const selectedCategoryQuery = selectedCategories.length > 0 ? selectedCategories.join(',') : '';
    const selectedFilterQuery= Object.keys(appliedFilter).length > 0 ? {
            range : appliedFilter.range !='' ? appliedFilter.range.join(',') : '',
            area :appliedFilter.area,
            city: appliedFilter.city
        }: {range :'',area:'',city:''};
    let queryobj= {
          category: selectedCategoryQuery,
          page: e,
          search: router.query.search,
          range:selectedFilterQuery.range,
          area:selectedFilterQuery.area,
          city:selectedFilterQuery.city
        }
    let updatedQueryObj=Object.fromEntries(Object.entries(queryobj).filter(([k, v]) => (v != '' && v!= undefined && v != null) ));
    router.push({
      query:updatedQueryObj,
    });
    
    window.scrollTo({
      top: 0,
      behavior: "smooth", // This enables smooth scrolling
    });
  };
  // useEffect(() => {
  //   router.back();
  // }, []);


  // second call of categories
  useEffect(() => {
    API.readAll(`/designers/categories`)
      .then(async (response) => {
        const cats = response.data.map((cat) => ({
          slug: cat.id,
          name: cat.name
        }));
        setCatsProf(cats);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //  call of cities
  useEffect(() => {
    API.readAll(`/world/cities`)
      .then(async (response) => {
        const all_cities = response.data.map((cityItem) => ({
          id:cityItem.id,
          city:cityItem.name
        }));
        setCities(all_cities);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

 const handleClearFilters =()=>{
      let queryobj= {
          category:'',
          page: 1,
          search: '',
          range:'',
          area:'',
          city:''
        }
    let updatedQueryObj=Object.fromEntries(Object.entries(queryobj).filter(([k, v]) => (v != '' && v!= undefined && v != null) ));
    router.push({
      query:updatedQueryObj,
    });
  }
  const val = useRef(0);
  const handleRef = () => {
    val.current = 1;
  };
  const openCloseSidebar = () => {
    if (sidebarView) {
      setSidebarView(!sidebarView);
    } else {
      setSidebarView(!sidebarView);
    }
  };
  const handleToggle = (value) => () => {
    setPage(1);
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };


  console.log('datttty',data);
  return (
    <CommonLayout title={"Professionals"} parent="home">
      <Container className="mb-5 d-none">
        <div class="row align-items-center">
          <div class="col-lg-4 order-2  order-lg-1">
            <div class="text-center text-lg-left">
              <h1
                style={{
                  fontSize: "46px",
                  fontWeight: "700",
                  lineHeight: "1.2",
                  textTransform: "none"
                }}
              >Designers</h1>
              <p style={{ color: "#000" }}>Our community has more than <strong>1100</strong> professional designers.</p>
              <a href="" class="btn btn-primary" target="_blank">
                Request a designer
              </a>
            </div>
          </div>
          <div class="col-lg-8 order-1 order-lg-2">
            <div class="hero-section-img">
              <img src="https://esorus.com/uploads/2022/12/21/dynamic-content/image/35959.png" class="desktop-img" alt="Designers" style={{ width: "100%" }} />
            </div>
          </div>
        </div>
      </Container>
      <Container>
        {catsProf ? (
          <div style={{ position: "sticky", left: "0" }}>
            <TopCategory
              data={{ data: catsProf || [] }}
              closeSidebar={openCloseSidebar}
              sidebarView={sidebarView}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              appliedFilter={appliedFilter}
              setAppliedFilter={setAppliedFilter}
              cities={cities}
              range={range}
              setRange={setRange}
            />
          </div>
        ) : (
          <div
            style={{
              height: "300px",
              width: "280px",
              overflow: "hidden",
            }}
          >
            <div className="col-xl-12 col-lg-12 col-12">
              <PostLoader />
            </div>
          </div>
        )}
        <div className="row">
          {data instanceof Object && !data?.data?.length && loading ? (
            <div style={{ display: "flex", gap: "20px" }}>
              <div
                style={{
                  height: "200px",
                  width: "280px",
                  overflow: "hidden",
                }}
              >
                <div className="col-xl-12 col-lg-12 col-12">
                  <PostLoader />
                </div>
              </div>
              <div
                style={{
                  height: "200px",
                  width: "280px",
                  overflow: "hidden",
                }}
              >
                <div className="col-xl-12 col-lg-12 col-12">
                  <PostLoader />
                </div>
              </div>
              <div
                style={{
                  height: "200px",
                  width: "280px",
                  overflow: "hidden",
                }}
              >
                <div className="col-xl-12 col-lg-12 col-12">
                  <PostLoader />
                </div>
              </div>
            </div>
          ) : data?.data?.length == 0 ?
          (<>
            
              <div className="col-12">
                  <div className="text-center ">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-face-id-error" width="70" height="70" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 8v-2a2 2 0 0 1 2 -2h2" stroke="#1976d2"/><path d="M4 16v2a2 2 0 0 0 2 2h2" stroke="#1976d2"/><path d="M16 4h2a2 2 0 0 1 2 2v2" stroke="#1976d2" /><path d="M16 20h2a2 2 0 0 0 2 -2v-2" stroke="#1976d2"/><path d="M9 10h.01" stroke="#1976d2"/><path d="M15 10h.01" stroke="#1976d2" /><path d="M9.5 15.05a3.5 3.5 0 0 1 5 0" stroke="#1976d2"/></svg>
                    <div style={{fontSize:'26px'}}>Sorry, we couldn't find anything to match your search. </div>
                    <button class="btn" style={{textDecoration:'underline'}} onClick={handleClearFilters}>Clear Filter</button>
                  </div>
              </div>
            
            </>):
          (  
            data?.data?.map((item) => {
              const images = [];
              item.projects.map((project) => {
                project.gallery.map((img) => {
                  images.push(img);
                });
                return null;
              });
              return (
                <Box key={item.id} className="col-12 col-sm-6 col-md-4" sx={{ marginBottom: "2rem" }}>
                  <Link
                    style={{ width: "200px"}}
                    href={`/professionals/profile/${item.id}`}
                    passHref
                  >
                    <Card
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "10px",
                        height: "100%",
                        boxShadow: "0px 0px 10px rgba(0,0,0,.1)",
                        border: " 1px solid #eee",
                        borderRadius: "10px",
                        cursor : "pointer",
                      }}
                      sx={{
                        boxShadow: "none",
                        borderRadius: "0",
                        display: { xs: "block", md: "flex" },
                        mb: 2,
                      }}
                    >
                      <CardContent
                        sx={{
                          padding: { xs: "0px 0px", md: "0px 0px" },
                          width: { xs: "100%", md: "100%" },
                        }}
                      >
                        <Box
                          sx={{
                            display: "block",
                          }}
                        >
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Avatar
                              sx={{
                                borderRadius: "50%",
                                width: { xs: "60px", md: "90px" },
                                height: { xs: "60px", md: "90px" },
                              }}
                              alt={item.name}
                              src={item?.avatar}
                            />
                            <Box sx={{ width: "calc(100% - 111px)" }}>
                              <Typography
                                sx={{
                                  width: "170px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  fontSize: "16px",
                                  fontWeight: "600",
                                }}
                                variant="h6"
                                component="div"
                              >
                                {item.name}
                              </Typography>
                              <Box>
                                { item.job_title &&
                                <Typography
                                  direction="row"
                                  spacing={0}
                                  sx={{
                                    mt: 4,
                                    fontSize: "14px",
                                    background: "#133b69",
                                    color: "#ffffff",
                                    fontWeight: "500",
                                    padding: "2px 8px 4px",
                                    borderRadius: "3px",
                                    textTransform: "capitalize",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                  variant="p"
                                >
                                  {item.job_title}
                                </Typography>
                                }
                            <Stack
                            direction="row"
                            spacing={0}
                            sx={{
                              mt: 1,
                              mb: 1,
                              flexWrap: { xs: "wrap", md: "wrap" },
                              overflowX: "auto",
                              maxWidth: "100%",
                              width: "100%",
                              textOverflow: "ellipsis"
                            }}
                            >
                            {item.categories.slice(0, 2).map((item) => {
                              return (
                              <Chip
                                sx={{
                                borderRadius: "5px",
                                fontSize: "14px",
                                height: "26px",
                                color: "gray",
                                mr: 1,
                                mb: 1,
                                }}
                                label={item?.name}
                              />
                              );
                            })}
                            </Stack>
                                </Box>
                              </Box>
                            </Box>
                            <Box>
							              <Typography
                                sx={{
                                  width: "100%",
                                  display: "-webkit-box",
                                  WebkitLineClamp: "2",
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "pre-line",
                                }}
                              >
                                {item.bio}
                              </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                      <Box
                        sx={{
                          mb: { xs: 0, md: 0 },
                        }}
                      >
                        {images.length > 0 ? (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              gap: "5px"
                            }}
                          >
                            {images.slice(0, 3).map((image) => {
                              return (
                                <img
                                  style={{
                                    width: "30%",
                                    height: "82px",
                                    objectFit: "cover",
                                    borderRadius: "7px",
                                    overflow: "hidden"
                                  }}
                                  src={image.url || "/assets/images/male.jpg"}
                                />
                              );
                            })}
                          </Box>
                        ) : (
                          <img
                            style={{
                              height: "80px",
                              width: "80px",
                              objectFit: "cover",
                              borderRadius: "7px",
                            }}
                            src={"/assets/images/furniture/2.jpg"}
                          />
                        )}
                      </Box>
                    </Card>
                  </Link>
                </Box>
              );
            })
            
          )}

          {data[0] === "" && !loading && (
            <Col xs="12">
              <div>
                <div className="col-sm-12 empty-cart-cls text-center">
                  <Image
                    width={"250%"}
                    height={"300%"}
                    src={`/assets/images/empty-search.jpg`}
                    className="img-fluid mb-4 mx-auto"
                    alt=""
                  />
                  <h3>
                    <strong>No Professionals Found</strong>
                  </h3>
                  <h4>Explore more some Professionals.</h4>
                </div>
              </div>
            </Col>
          )}
        </div>
        <div
          id={"pagination"}
          className="typo-content my-5 d-flex justify-content-center pagination"
        >
          <ReactPaginate
            current={parseInt(router.query.page)}
            total={data?.meta ? data?.meta.last_page : 0}
            onPageChange={handlePageChange}
            previousLabel={"<"}
            nextLabel={">"}
          />
        </div>
      </Container>
    </CommonLayout >
  );
};
export default Professionals;
