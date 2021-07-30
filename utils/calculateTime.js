import moment from "moment";
import Moment from "react-moment";

const calculateTime = createdAt => {
  const today = moment(Date.now());
  const postDate = moment(createdAt);
  const diffInHours = today.diff(postDate, "hours");

  if (diffInHours < 24) {
    return (
      <>
        امروز <Moment format="hh:mm">{createdAt}</Moment>
      </>
    );
  } else if (diffInHours > 24 && diffInHours < 36) {
    return (
      <>
        دیروز <Moment format="hh:mm">{createdAt}</Moment>
      </>
    );
  } else if (diffInHours > 36) {
    return <Moment format="DD/MM/YYYY hh:mm">{createdAt}</Moment>;
  }
};

export default calculateTime;
