import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody, Input } from "reactstrap";
import DataTable from "react-data-table-component";
import Select from "react-select";
import API from "../../../../helpers/API/API";

const Shipping = () => {
  const [cities, setCities] = useState([]);
  const [data, setData] = useState();
  const [table, setTable] = useState([]);
  const [category, setCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    API.readAll("/vendor/used_categories")
      .then(async (response) => {
        const category = [];
        response.data.map((item, index) => {
          category.push({ value: item.id, label: item.name });
        });
        await setCategory(category);
      })
      .catch((error) => {
        console.log(error);
      });

    API.readAll(`/world/cities`)
      .then(async (response) => {
        const arr = [];
        for (let i = 0; i < response.data.length; i++) {
          arr.push({
            name: response.data[i].name,
            city_id: response.data[i].id,
            shipping_fees: 0,
          });
        }
        await setCities(arr);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleChangeFees = (id, value) => {
    setTable(
      table.map((city) =>
        city.city_id === id ? { ...city, shipping_fees: parseInt(value) } : city
      )
    );
  };
  const columns = [
    {
      name: "City",
      selector: "name",
      sortable: true,
    },
    {
      name: "Shipping fees",
      conditionalCellStyles: [
        {
          when: (row) => row.shipping_fees > 0,
          style: {
            color: "white",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
      cell: (row) => (
        <>
          <Input
            style={{
              border: ".5px solid rgb(232, 234, 226)",
              width: "100%",
              backgroundColor: "transparent",
            }}
            onChange={(e) => handleChangeFees(row.city_id, e.target.value)}
            type="number"
            defaultValue={row.shipping_fees}
          />
        </>
      ),
    },
  ];
  const [categoryId, setCategoryId] = useState();

  const handleChangeCategory = async (e) => {
    setIsLoading(true);
    await setCategoryId(e.value);
    const arr = [];
    data
      .filter((item) => item.category.id === e.value)
      .map((item) => {
        arr.push({
          name: item.city.name,
          city_id: item.city.id,
          shipping_fees: item.shipping_fees,
        });
      });
    if (arr.length > 0) {
      await setTable(arr);
    } else {
      await setTable(cities);
    }
    setIsLoading(false);
  };

  const handleClickSaveFees = () => {
    API.update("/vendor/shipping_fees/update", {
      shipping: table,
      categories: [categoryId],
    });
  };

  useEffect(() => {
    API.readAll("/vendor/shipping_fees")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [categoryId]);
  return (
    <>
      <Row>
        <Col sm="12">
          <Card className="dashboard-table mt-0">
            <CardBody>
              <h5>Select Categories</h5>
              <Select options={category} onChange={handleChangeCategory} />
              {table.length > 0 && (
                <>
                  <h5 className="mt-4">Shipping fees</h5>
                  {isLoading ? (
                    <div></div>
                  ) : (
                    <DataTable
                      columns={columns}
                      data={table}
                      defaultSortField="title"
                    />
                  )}
                  <button
                    className={`btn btn-solid mt-3`}
                    onClick={handleClickSaveFees}
                  >
                    {"Save"}{" "}
                  </button>
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Shipping;
