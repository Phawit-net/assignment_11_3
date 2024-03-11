import { useState } from "react";
import { dataList } from "./data";
import "./style.css";

interface Lists {
  type: string;
  name: string;
}

interface Timeout {
  id: number;
  name: string;
  type: string;
}

const TodolistPage = () => {
  const [list, setList] = useState(dataList);
  const [select, setSelect] = useState<Lists[]>([]);
  const [timeoutIds, setTimeoutIds] = useState<Timeout[]>([]);

  const moveSelectBack = (type: string, item: Lists) => {
    if (type === "wait") {
      const id = setTimeout(() => {
        //remove item from select list
        setSelect((select) => select.filter((list) => list.name !== item.name));
        //set item back to list
        setList((prev) => [...prev, item]);
        //remove timeout list after 5 second
        setTimeoutIds((prevTimeoutIds) =>
          prevTimeoutIds.filter((list) => list.name !== item.name)
        );
        // }
      }, 5000);

      //set timeout id for intervene by click
      setTimeoutIds((prevTimeoutIds) => [...prevTimeoutIds, { id, ...item }]);
    } else if (type === "click") {
      // If move back by click
      // get timeoutId by click item
      const timeoutId = timeoutIds.filter((list) => list.name === item.name)[0];
      if (timeoutId) {
        //stop timeout
        clearTimeout(timeoutId.id);

        //set new list and select
        const newList = select.filter((list) => list.name !== item.name);
        setList((prev) => [...prev, item]);
        setSelect(newList);
      }
    }
  };

  const handleCategries = (item: Lists) => {
    // return new list
    const newLists = list.filter((list) => list.name !== item.name);
    setList(newLists);
    // set new select lsit
    setSelect((prev) => [...prev, { ...item }]);
    // call function setTimeout after 5 second
    moveSelectBack("wait", item);
  };

  return (
    <div className="grid">
      <div>
        <ul className="list">
          {list.map((item, index) => (
            <li
              key={"list_" + index}
              className="itemsCard"
              onClick={() => {
                handleCategries(item);
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div>Fruit</div>
        <ul className="list">
          {select
            .filter((item) => item.type == "Fruit")
            .map((item, index) => (
              <li
                key={"fruit_" + index}
                style={{
                  border: "1px solid black",
                  margin: "4px",
                  padding: "4px",
                }}
                onClick={() => {
                  moveSelectBack("click", item);
                }}
              >
                {item.name}
              </li>
            ))}
        </ul>
      </div>

      <div>
        <div>Vegetable</div>
        <ul className="list">
          {select
            .filter((item) => item.type == "Vegetable")
            .map((item, index) => (
              <li
                key={"vegetable" + index}
                className="itemsCard"
                onClick={() => {
                  moveSelectBack("click", item);
                }}
              >
                {item.name}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default TodolistPage;
