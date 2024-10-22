import React, { useState, useContext, useEffect } from "react";
import { Collapse, Input } from "reactstrap";
import FilterContext from "../../../helpers/filter/FilterContext";
import "antd/dist/antd.css";
import router from "next/router";
import { useTranslation } from "react-i18next";
import { FormGroup,Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import InputRange from "react-input-range";
import API from "../../../helpers/API/API";


const FilterModal = ({ range,modal,toggle,appliedFilter,setAppliedFilter,cities}) => {
    const [city, setCity] = useState(router.query.city ? router.query.city :  '');
    const [areas, setAreas] = useState();
    const [area, setArea] = useState(router.query.area ? router.query.area :  '');
    const [isHovering, setIsHovering] = useState(false);

    const queryRange= router.query.range?.split(',');

    const [currentRange,setCurrentRange]= useState( queryRange == undefined ? range : {min:queryRange[0],max:queryRange[1]} );
    

    const handleMouseEnter = () => {
        setIsHovering(true);
    };
    const handleMouseLeave = () => {
        setIsHovering(false);
    };
    
useEffect(() => {
    if(city){
    API.readAll(`/world/cities/${city}/areas`)
      .then(async (response) => {
        const all_areas = response.data.map((areaItem) => ({
          id:areaItem.id,
          area:areaItem.name
        }));
        console.log('all areas',all_areas);
        setAreas(all_areas);
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }, [city]);

    const clearFilter =()=>{
        setCurrentRange({
            min: 0,
            max: range.max,
        });
        setArea("");
        setCity("");
    }
    const handleApplyFilter= ()=>{
        let rangeArr=[currentRange.min,currentRange.max];
        setAppliedFilter({'range': rangeArr,'city':city ,'area':area});
        toggle();
        const pathname = window.location.pathname;
        console.log('result of ', (rangeArr[0] != 0 && rangeArr[1] !=25 ));
        let queryobj={
                category: router.query.category,
                page: '1',
                search: router.query.search,
                range:(rangeArr[0] == range.min && rangeArr[1] == range.max) ? '': rangeArr.join(','),
                city:city,
                area:area,
            }
        let updatedQueryObj= Object.fromEntries(Object.entries(queryobj).filter(([k, v]) => (v != '' && v!= undefined && v != null)  ));
        router.push({
            pathname: pathname,
            query: updatedQueryObj,
        });
    }

 return (
        <>
        <Modal isOpen={modal} toggle={toggle} centered={true}>
        <ModalHeader toggle={toggle}>Filters</ModalHeader>
        <ModalBody>
            <div className="p-4">
                <div className="wrapper filterarea" style={{paddingBottom:'20px',borderBottom :'1px solid #ced4da'}}>
                    <label className="font-weight-bold" style={{fontSize:"18px"}}>Experience</label>
                    <div style={{ zIndex: "100" }} className="range-slider p-2">
                        <InputRange
                        maxValue={range.max}
                        minValue={0}
                        value={currentRange}
                        onChange={(val) => {
                            setCurrentRange(val);
                        }}
                        />
                    </div>
                    <div className="row">
                        <div className="col-6"> 
                        <label className="">Min Years</label>
                        <Input
                            type="text"
                            className="form-control px-2 rounded"
                            value={currentRange.min}
                            disabled
                        />
                    </div>
                    <div className="col-6">
                        <label className="">Max Years</label>                            
                        <Input
                            type="text"
                            className="form-control px-2 rounded"
                            value={currentRange.max}
                            disabled
                        />
                    </div>
                    </div>
                </div>
                <div className="wrapper filterarea">
                    <label className="font-weight-bold" style={{fontSize:"18px"}}>Location</label>
                    <div className="row">
                        <div className="col-6"> 
                            <FormGroup>
                                <Input className="form-control rounded px-2" type="select" value={city} onChange={(e) => setCity(e.target.value)}>
                                    <option disabled  value="">City</option>
                                    {cities?.map(city =>
                                        <option value={city.id}>{city.city}</option>
                                    )}
                                </Input>
                            </FormGroup>
                        </div>
                        <div className="col-6"> 
                            <FormGroup>
                                <Input className="form-control rounded px-2" type="select" value={area} onChange={(e) => setArea(e.target.value)}>
                                    <option disabled  value="">Area</option>
                                    {areas?.map(area =>
                                        <option value={area.id}>{area.area}</option>
                                    )}
                                </Input>
                            </FormGroup>
                        </div>
                    </div>
                </div>
            </div>
        </ModalBody>
        <ModalFooter className="d-flex justify-content-between">
            <button className="btn" style={{textDecoration:'underline'}} onClick={()=>clearFilter()}>
                clearFilter
            </button>
            <button className="btn" onClick={handleApplyFilter} style={{background:isHovering ? 'gray':'#133b69',color:'white'}} onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                Apply
            </button>
        </ModalFooter>
    </Modal>
        </>
    );
};

export default FilterModal;
