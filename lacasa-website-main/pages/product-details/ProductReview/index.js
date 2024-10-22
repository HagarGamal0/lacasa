import React from "react";
import {
  LinearProgress,
  TextField,
  Rating,
  Box,
  Avatar,
  Typography,
  Divider,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import moment from "moment";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useSelector } from "react-redux";
import router from "next/router";
import API from "../../../helpers/API/API";
import { useTranslation } from "react-i18next";

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1, color: "#faaf00" }}>
        <LinearProgress
          color="inherit"
          style={{ height: "10px" }}
          variant="determinate"
          {...props}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="grey.500">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const ProductReview = ({ data }) => {
  const {
    clearErrors,
    setError,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const [openDialog, setOpenDialog] = React.useState({ open: false });
  const [reviewCreated, setReviewCreated] = React.useState({ open: false });

  const handleClickOpen = () => {
    if (user) {
      setOpenDialog({ open: true });
    } else {
      router.push({
        pathname: `/page/account/login`,
        query: { prevURL: `/product-details/${data.slug}` },
      });
    }
  };

  const handleClose = () => {
    setOpenDialog({ open: false });
  };

  const onSubmit = (review) => {
    if (review.stars) {
      API.create(`/products/${data.id}/reviews`, review)
        .then((res) => {
          setReviewCreated({ open: true, message: res.data.message });
          setTimeout(() => {
            setOpenDialog({ open: false });
          }, 5000);
        })
        .catch((err) => console.log(err));
    } else {
      setError("stars", { type: "custom", message: "Rate is required" });
    }
  };
  const { t } = useTranslation();

  return (
    <Box>
      <Box className="end-ar" style={{ marginBottom: 15, marginTop: 50 }}>
        <h2 className={`title-inner1 mb-2`} style={{ fontSize: 18 }}>
          {t("Review this product")}
        </h2>
        <Typography variant="p" component="p">
          {t("Share your thoughts with other customers")}
        </Typography>
        <Button
          className="text-secondary p-0 mt-2"
          style={{ textDecoration: "underline" }}
          onClick={() => handleClickOpen()}
        >
          {t("Write a customer review")}
        </Button>
      </Box>
      <Divider style={{ marginTop: 15, marginBottom: 15 }} />
      <Box
        style={{
          marginBottom: 15,
          marginTop: 50,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        className="flex-ar"
      >
        <h2 className={`title-inner1 mb-0`} style={{ fontSize: 18 }}>
          {t("Prodcut Review")}
        </h2>
        <Box style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Typography variant="p" component="p">
            {data.rating.average}/5
          </Typography>
          <Rating
            precision={0.5}
            name="read-only"
            value={data.rating.average}
            readOnly
          />
        </Box>
      </Box>
      <Box style={{ marginBottom: 20 }}>
        {data.rating.detailed.map((detail) => {
          return (
            <Box
              style={{
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Typography style={{ width: "15%" }} variant="p" component="p">
                {detail.key}
              </Typography>
              <Box style={{ width: "85%" }}>
                <LinearProgressWithLabel value={detail.value} />
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box>
        {data.reviews.map((review) => {
          return (
            <Box>
              <Box style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar style={{ width: 26, height: 26 }} />
                <Typography
                  style={{ textTransform: "capitalize" }}
                  variant="p"
                  component="p"
                >
                  {review.user.name} -{" "}
                  <Typography variant="span" style={{ color: "#c45500" }}>
                    {review.user.tag}
                  </Typography>
                </Typography>
              </Box>
              <Box
                style={{
                  marginTop: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Rating
                  name="read-only"
                  size="small"
                  value={review.stars}
                  readOnly
                />
                <Typography
                  style={{ color: "black" }}
                  variant="p"
                  component="p"
                >
                  {review.content.title}
                </Typography>
              </Box>
              <Box style={{ marginTop: 10 }}>
                <Typography variant="p" component="p">
                  {moment(review.created_at).format("MMMM Do YYYY, h:mm:ss a")}
                </Typography>
              </Box>
              <Box style={{ marginTop: 10 }}>
                <Typography
                  style={{ color: "black", lineHeight: 1.5 }}
                  variant="p"
                  component="p"
                >
                  {review.content.description}
                </Typography>
              </Box>
              <Divider style={{ marginTop: 15, marginBottom: 15 }} />
            </Box>
          );
        })}
      </Box>
      <div>
        <Dialog
          open={openDialog.open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {reviewCreated.open ? (
            <>
              <Typography
                style={{ padding: 30, textAlign: "center", color: "green" }}
              >
                {reviewCreated.message}
              </Typography>
            </>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogTitle id="alert-dialog-title">
                {`${t("Review for")} "${data.name}"`}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <Rating
                    onChange={(e) => {
                      clearErrors("stars");
                      setValue("stars", +e.target.value);
                    }}
                    size="large"
                  />
                  <ErrorMessage
                    errors={errors}
                    name="stars"
                    render={({ message }) => (
                      <p
                        style={{
                          fontSize: "12px",
                          marginTop: "5px",
                          color: "red",
                        }}
                      >
                        {message}
                      </p>
                    )}
                  />
                  <TextField
                    className="w-100 inputBtn mb-2"
                    type={"text"}
                    {...register("title", { required: "Title is required*" })}
                    label="Title"
                    variant="filled"
                    required
                  />
                  <ErrorMessage
                    errors={errors}
                    name="description"
                    render={({ message }) => (
                      <p
                        style={{
                          fontSize: "12px",
                          marginTop: "5px",
                          color: "red",
                        }}
                      >
                        {message}
                      </p>
                    )}
                  />
                  <TextField
                    rows={4}
                    className="w-100 inputBtn mb-2"
                    type={"text"}
                    {...register("description", {
                      required: "Description is required*",
                    })}
                    label="Description"
                    variant="filled"
                    required
                  />
                  <ErrorMessage
                    errors={errors}
                    name="description"
                    render={({ message }) => (
                      <p
                        style={{
                          fontSize: "12px",
                          marginTop: "5px",
                          color: "red",
                        }}
                      >
                        {message}
                      </p>
                    )}
                  />
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Disagree</Button>
                <Button type="submit" autoFocus>
                  Agree
                </Button>
              </DialogActions>
            </form>
          )}
        </Dialog>
      </div>
    </Box>
  );
};

export default ProductReview;
