import React, { useState, useContext, useEffect } from "react";
import { Collapse, Input } from "reactstrap";
import FilterContext from "../../../helpers/filter/FilterContext";
import { Menu } from "antd";
import "antd/dist/antd.css";
import router from "next/router";
import { useTranslation } from "react-i18next";
import { Box, Button } from "@mui/material";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/navigation';
import { Scrollbar, Navigation, FreeMode } from 'swiper/modules';
import { FormGroup,Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import InputRange from "react-input-range";
import FilterModal from "./filterModal";
import API from "../../../helpers/API/API";


const TopCategory = ({ data, sidebarView, closeSidebar, selectedCategories, setSelectedCategories,appliedFilter,setAppliedFilter,cities,range,setRange }) => {
    const context = useContext(FilterContext);
    const setSelectedCategory = context.setSelectedCategory;
    const setSelectedSearch = context.setSelectedSearch;
    const [flattenedCategories, setFlattenedCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const { t } = useTranslation();
    // to spread all values of categories
    const flattenCategories = (categories) => {
        let flattened = [];
        categories.forEach(category => {
            flattened.push(category);
            if (category.childs && category.childs.length > 0) { // always false because data are passed have not childs
                flattened = flattened.concat(flattenCategories(category.childs));
            }
        });
        return flattened;
    };
    // get max


    useEffect(() => {
        setFlattenedCategories(flattenCategories(data.data));
    }, [data]);

    const handleCategorySelect = (slug) => {
        const isSelected = selectedCategories.includes(slug);
        let updatedCategories;

        if (isSelected) {
            updatedCategories = selectedCategories.filter(item => item !== slug);
        } else {
            updatedCategories = [...selectedCategories, slug];
        }

        setSelectedCategories(updatedCategories);

        const pathname = window.location.pathname;
        const selectedCategoryQuery = updatedCategories.length > 0 ? updatedCategories.join(',') : '';
        const selectedFilterQuery= Object.keys(appliedFilter).length > 0 ? {
            range : appliedFilter.range !='' ? appliedFilter.range.join(',') : '',
            area :appliedFilter.area,
            city: appliedFilter.city
        }: {range :'',area:'',city:''};
        let queryobj= {
                category: selectedCategoryQuery,
                page: '1',
                search: router.query.search,
                range:selectedFilterQuery.range,
                area:selectedFilterQuery.area,
                city:selectedFilterQuery.city
            }
        let updatedQueryObj=Object.fromEntries(Object.entries(queryobj).filter(([k, v]) => (v != '' && v!= undefined && v != null) ));
        console.log('new obj ',updatedQueryObj);
        router.push({
            pathname: pathname,
            query: updatedQueryObj,
        });

        if (sidebarView) {
            closeSidebar();
        }
    };

// in case of redirect with category -----
    const hasSelectedCategory = () => {
        const { query } = router;
        return query.category && query.category !== "";
    };

    useEffect(() => {
        if (hasSelectedCategory()) {
            const { query } = router;
            const selectedCategoryArray = query.category.split(',');
            setSelectedCategories(selectedCategoryArray);
        }
    }, []);

    // handle search click
    const handleSearch = () => {
        const selectedFilterQuery= Object.keys(appliedFilter).length > 0 ? {
            range : appliedFilter.range !='' ? appliedFilter.range.join(',') : '',
            area :appliedFilter.area,
            city: appliedFilter.city
        }: {range :'',area:'',city:''};
        const pathname = window.location.pathname;
        let queryobj= {
            category: router.query.category,
            page: '1',
            search: searchQuery,
            range:selectedFilterQuery.range,
            area:selectedFilterQuery.area,
            city:selectedFilterQuery.city
        }
        let updatedQueryObj=Object.fromEntries(Object.entries(queryobj).filter(([k, v]) => (v != '' && v!= undefined && v != null) ));
        console.log('new obj ',updatedQueryObj);
        router.push({
            pathname: pathname,
            query: updatedQueryObj,
        });
    };
   
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        setSearchQuery(router.query.search || "");
    }, [router.query.search]);
// end select 



    return (
        <>
        <div className="mt-3 mb-5 border-bottom border-top">
            <div className="row">
                <div className="col-lg-4 pr-lg-2 border-right d-flex align-items-center justify-content-center ">
                    <button className="btn mr-2" style={{border:"1px solid #ced4da"}} onClick={toggle}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-adjustments" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 10a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M6 4v4" /><path d="M6 12v8" /><path d="M10 16a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M12 4v10" /><path d="M12 18v2" /><path d="M16 7a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M18 4v1" /><path d="M18 9v11" /></svg>
                    </button>
                    <div className="input-group relative">
                        <Input
                            type="text"
                            className="form-control pl-4 rounded"
                            aria-label="Amount (to the nearest dollar)"
                            placeholder="Search......"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                        <button
                            className="border-0 outline-0 bg-transparent position-absolute top-50 d-block"
                            style={{
                                top: "50%",
                                transform: "translateY(-55%)",
                                padding: "0 0.35rem",
                                zIndex: "10"
                            }}
                            onClick={handleSearch}
                        >
                            <i className="fa fa-search"></i>
                        </button>
                    </div>
                </div>
                <div className="col-lg-8 px-lg-2">
                    <Swiper
                        scrollbar={{
                            hide: false,
                            draggable: true,
                        }}
                        slidesPerView={'auto'}
                        spaceBetween={10}
                        navigation={{
                            disabledClass: "swiper-button-disabled",
                            nextEl: `.s-slider-next.s-slider-nav-arrow`,
                            prevEl: `.s-slider-prev.s-slider-nav-arrow`
                        }}
                        freeMode={true}
                        modules={[Scrollbar, Navigation, FreeMode]}
                        className="mySwiper py-3"
                    >
                        {flattenedCategories.map((category, index) => (
                            <SwiperSlide style={{ maxWidth: "fit-content" }}>
                                <Button
                                    variant={selectedCategories.includes(category.slug.toString()) ? "contained" : "outlined"}
                                    key={index}
                                    onClick={() => {
                                        handleCategorySelect(category.slug.toString());
                                    }}
                                    sx={{
                                        whiteSpace: "nowrap",
                                        minWidth: "fit-content",
                                        maxWidth: "fit-content"
                                    }}
                                >
                                    {category.name}
                                </Button>
                            </SwiperSlide>
                        ))}
                        <div className="navigation-arrows-holder">
                            <button aria-label="Previous slide" className="s-slider-prev s-slider-nav-arrow" tabIndex="0" aria-controls="swiper-wrapper-104f8e6c262be9dce" aria-disabled="false">
                                <span className="s-slider-button-icon">
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                        <title>keyboard_arrow_left</title>
                                        <path d="M20.563 22.104l-1.875 1.875-8-8 8-8 1.875 1.875-6.125 6.125z"></path>
                                    </svg>
                                </span>
                            </button>
                            <button aria-label="Next slide" className="s-slider-next s-slider-nav-arrow" tabIndex="0" aria-controls="swiper-wrapper-104f8e6c262be9dce" aria-disabled="false">
                                <span className="s-slider-button-icon">
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                        <title>keyboard_arrow_right</title>
                                        <path d="M11.438 22.479l6.125-6.125-6.125-6.125 1.875-1.875 8 8-8 8z"></path>
                                    </svg>
                                </span>
                            </button>
                        </div>

                    </Swiper>
                </div>
            </div>
        </div >
        <FilterModal range={range}  modal={modal} toggle={toggle} appliedFilter={appliedFilter} setAppliedFilter={setAppliedFilter} cities={cities}/>
        </>
    );
};

export default TopCategory;
