import { useContext, useState } from "react"
import { AuthContext } from "../../context/authContext"
import "./comments.scss"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import moment from "moment"
import { makeRequest } from "../../axios";

moment().format()

const Comments = ({ postId }) => {

  const [desc, setDesc] = useState();
  const queryClient = useQueryClient();

  const { currentUser } = useContext(AuthContext)

  const { isLoading, error, data } = useQuery(["comments"], () =>
    makeRequest.get("/comments?postId=" + postId).then((res) => {
      return res.data
    })
  )

  // Mutations
  const mutation = useMutation(
    (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId  });
    setDesc("");
  };

 

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="currentUser" />
        <input type="text" placeholder="write a comment" value={desc} onChange={e=> setDesc(e.target.value)} />
        <button onClick={handleClick}>Submit</button>
      </div>
      {isLoading
        ? "loading"
        : data.map((comment) => (
            <div key={comment.id} className="comment">
              <img src={comment.profilePic} alt="commented user" />
              <div className="info">
                <span>{comment.name}</span>
                <p>{comment.desc}</p>
              </div>
              <span className="date">
                {moment(comment.createdAt).fromNow()}
              </span>
            </div>
          ))}
    </div>
  )
}

export default Comments
