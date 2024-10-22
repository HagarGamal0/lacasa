import { useState } from "react";
import { Col } from "reactstrap";
import EditIcon from "../../../../public/assets/images/svgImg/edit-icon.svg";
import { Modal, ModalBody, ModalFooter } from "reactstrap";
import { TextField } from "@mui/material";
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  updateUserProfile,
  detailsUser,
} from "../../../../helpers/redux/actions/userActions";
import { useTranslation } from "react-i18next";

const Info = ({ user, handleActive, setAccountInfo, setPassword, setInfo }) => {
  const toggle = () => setModal(!modal);
  const [modal, setModal] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ shouldUnregister: true });
  const dispatch = useDispatch();

  let defaultAddress = [];
  defaultAddress = user?.data.addressbook.shipping.filter(
    (shipping) => shipping.default === true
  );

  const onSubmit = async (data) => {
    const status = await dispatch(
      updateUserProfile({ ...{ _method: "PUT" }, ...data })
    );
    await dispatch(detailsUser());
    if (status) {
      toggle();
    }
  };
  const { t } = useTranslation();
  return (
    <Col lg="8">
      <div className="dashboard-right-n">
        <div className="dashboard">
          <div>
            <div className="card-container">
              <div className="start">{t("Phone")}</div>
              <div className="middel">
                <h6>{user?.data.phone}</h6>
              </div>
              <div className="end">
                <img src={EditIcon} />
                <span onClick={toggle}>{t("Edit account")}</span>
              </div>
            </div>
            <hr />
            <div className="card-container" style={{ minHeight: "0px" }}>
              <div className="start">{t("Address")}</div>
              <div className="middel">
                {defaultAddress?.length > 0 && (
                  <address>
                    {defaultAddress[0]?.address},{defaultAddress[0]?.area},
                    {defaultAddress[0]?.city}
                    <br />
                  </address>
                )}
              </div>
              <div className="end">
                <img src={EditIcon} />
                <span
                  id={"Address"}
                  onClick={(e) => {
                    handleActive(e);
                    setAccountInfo(false);
                  }}
                >
                  {t("Change address")}
                </span>
              </div>
            </div>
          </div>

          <Modal isOpen={modal} toggle={toggle} centered>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalBody className="p-4">
                {changePassword ? (
                  <div className="row">
                    <div className="col-12 mb-2">
                      <TextField
                        className="w-100 inputBtn end-ar"
                        type={"password"}
                        {...register("password", {
                          required: t("Password is required*"),
                        })}
                        label={t("New password")}
                        variant="filled"
                        required
                      />
                      <ErrorMessage
                        errors={errors}
                        name="password"
                        render={({ message }) => (
                          <p className={"errorStyle"}>{message}</p>
                        )}
                      />
                    </div>
                    <div className="col-12 mb-2">
                      <TextField
                        defaultValue={user?.data.name}
                        className="w-100 inputBtn end-ar"
                        type={"password"}
                        {...register("password_confirmation", {
                          required: t(
                            "Password confirmation field is required*"
                          ),
                          validate: (value) => {
                            return (
                              value === watch("password") ||
                              t("The passwords do not match")
                            );
                          },
                        })}
                        label={t("Password confirmation")}
                        variant="filled"
                        required
                      />
                      <ErrorMessage
                        errors={errors}
                        name="password_confirmation"
                        render={({ message }) => (
                          <p className={"errorStyle"}>{message}</p>
                        )}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    <div className="col-12 mb-2">
                      <TextField
                        defaultValue={user?.data.name}
                        className="w-100 inputBtn end-ar"
                        type={"text"}
                        {...register("name", {
                          required: t("Name is required*"),
                        })}
                        label={t("Name")}
                        variant="filled"
                        required
                      />
                      <ErrorMessage
                        errors={errors}
                        name="name"
                        render={({ message }) => (
                          <p className={"errorStyle"}>{message}</p>
                        )}
                      />
                    </div>
                    <div className="col-12 mb-2">
                      <TextField
                        maxLength="11"
                        minLength="11"
                        id={"inputField"}
                        type="number"
                        className={"inputBtn w-100 end-ar"}
                        defaultValue={user?.data.phone}
                        {...register("phone", {
                          required: t("Phone field is required*"),
                          minLength: {
                            value: 11,
                            message: t(
                              "The phone number must be 11 characters*"
                            ),
                          },
                          maxLength: {
                            value: 11,
                            message: t(
                              "The phone number must be 11 characters*"
                            ),
                          },
                        })}
                        label={t("Phone")}
                        variant="filled"
                        required
                      />
                      <ErrorMessage
                        errors={errors}
                        name="name"
                        render={({ message }) => (
                          <p className={"errorStyle"}>{message}</p>
                        )}
                      />
                    </div>
                    <div
                      className="col-12"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ width: "100%" }} className="end-ar">
                        <img className="mr-1" src={EditIcon} />
                        <span
                          style={{ textDecoration: "underline" }}
                          onClick={(e) => {
                            reset();
                            setChangePassword(true);
                          }}
                        >
                          {t("Change password")}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter className="border-0">
                <div
                  style={{
                    width: "100%",
                    justifyContent: "flex-end",
                  }}
                  className="d-flex flex-ar"
                >
                  <div className="d-flex">
                    <button
                      type="button"
                      onClick={() => {
                        toggle();
                      }}
                      className={"btn p-0 "}
                      style={{ textDecoration: "underline" }}
                    >
                      {t("Cancel")}
                    </button>

                    <button
                      type="submit"
                      className={"btn px-4 pt-3 pb-3 ml-2"}
                      style={{
                        border: "0px",
                        background: "black",
                        color: "white",
                      }}
                    >
                      {t("Save change")}
                    </button>
                  </div>
                </div>
              </ModalFooter>
            </form>
          </Modal>
        </div>
      </div>
    </Col>
  );
};

export default Info;
