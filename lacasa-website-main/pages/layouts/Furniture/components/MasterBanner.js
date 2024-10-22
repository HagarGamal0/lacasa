import Link from "next/link";

const MasterBanner = ({ img, key, link, classes, fullWidth }) => {
  return (
    <div key={key}>
      <Link href={link} passHref>
        <a rel="noopener noreferrer">
          <div
            className={`home ${img} ${classes ? classes : "text-center"}`}
            style={{
              backgroundImage: `url(${img})`,
              borderRadius: fullWidth ? "0px" : "10px",
            }}
          />
        </a>
      </Link>
    </div>
  );
};

export default MasterBanner;
