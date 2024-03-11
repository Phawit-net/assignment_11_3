import axios from "axios";
import { useEffect, useState } from "react";
import _ from "lodash";

interface Company {
  department: string;
  name: string;
}

interface Address {
  address: string;
  postalCode: string;
}

interface Hair {
  color: string;
}

interface Person {
  company: Company;
  gender: string;
  hair: Hair;
  age: number;
  address: Address;
  firstName: string;
  lastName: string;
}

interface TransformedData {
  [department: string]: {
    male: number;
    female: number;
    ageRange: string;
    hair: Record<string, number>;
    addressUser: Record<string, string>;
  };
}

const DataApiPage = () => {
  const [data, setData] = useState<TransformedData>({});

  useEffect(() => {
    axios
      .get(`https://dummyjson.com/users`)
      .then((res) => {
        const { data } = res;
        const transformData = transform(data.users);
        setData(transformData);
        console.log(transformData);
      })
      .catch((err) => {
        window.alert(err);
      });
  }, []);

  const transform = (data: Person[]) => {
    const transformedData: TransformedData = _(data)
      .groupBy("company.department")
      .mapValues((items: Person[]) => {
        //structure of result
        const result: TransformedData[string] = {
          male: 0,
          female: 0,
          ageRange: "",
          hair: {},
          addressUser: {},
        };

        //keep user age
        const ageArray: number[] = [];
        //loop all user
        _.forEach(items, (item) => {
          //count gender
          if (item.gender === "male") {
            result.male++;
          } else if (item.gender === "female") {
            result.female++;
          }
          ageArray.push(item.age);

          //count hair color
          result.hair[item.hair.color] =
            (result.hair[item.hair.color] || 0) + 1;
          result.addressUser[`${item.firstName}${item.lastName}`] =
            item.address.postalCode;
        });

        //get min,max age
        const minAge = _.min(ageArray) || 0;
        const maxAge = _.max(ageArray) || 0;
        result.ageRange = `${minAge}-${maxAge}`;

        return result;
      })
      .value();
    return transformedData;
  };

  return (
    <div>
      transform data :<div>{JSON.stringify(data)}</div>
    </div>
  );
};

export default DataApiPage;
