import React, { useEffect, useState } from "react";
import {
    Row,
    Col,
    Container,
    FormGroup,
    Label,
    Input
} from "reactstrap";

import 'rc-slider/assets/index.css';

import { useForm } from "react-hook-form";
import Router from "next/router";


const FirstSlide = ({ title, options, setSliderStatus, nextPage, prevPage }) => {

    const handleSetSelected = async (e) => {

        const timer = setTimeout(() => {
            if (nextPage === "Home") {
                Router.push('/')
            }
            setSliderStatus(nextPage);
        }, 500);
        return () => clearTimeout(timer);

    }

    return (
        <>
            <Row >
                <Col lg="12" xs="12">
                    <Container fluid={true}>
                        <div className="feedBack-options mt-5">
                            <h3 style={{ fontSize: '28px' }}>{title}</h3>
                            <div className="text-center">
                                <FormGroup tag="fieldset" onChange={(e) => handleSetSelected(e)} >
                                    {options.map((item, index) => {
                                        return (
                                            <FormGroup check style={{ textAlign: 'left', margin: '15px', fontSize: '20px' }} >
                                                <Label check>
                                                    <Input style={{ fontSize: '20px', marginTop: "0.6rem" }} value={index} type="radio" name="radio1" /> {item}
                                                </Label>
                                            </FormGroup>
                                        )
                                    })}
                                </FormGroup>
                            </div>
                            {prevPage &&
                                <button className="btn-solid mt-5" onClick={() => setSliderStatus(prevPage)}>Back</button>
                            }

                        </div>
                    </Container>
                </Col>
            </Row>

        </>
    );
};

export default FirstSlide;
