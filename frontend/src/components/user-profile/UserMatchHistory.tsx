import useUserStore from "@/store/useUserStore";
import axios from "axios";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { formatDate } from "./UserProfile";
import "@/styles/globals.css";

const MatchHistory = ({ mode }: { mode: number }) => {
  const userData = useUserStore((state) => state.userData);
  const [isRender, setIsRender] = useState(false);
  const [userMatchHistory, setUserMatchHistory] = useState<any[]>([]);
  const oopsPath =
    "M288 48C173.1 48 80 141.1 80 256C80 261.7 80.23 267.4 80.68 272.1L80.01 272.1C68.39 256.5 48.28 252.2 32.02 259.3C32.01 258.2 32 257.1 32 256C32 114.6 146.6 0 288 0C429.4 0 544 114.6 544 256C544 397.4 429.4 512 288 512C213.5 512 146.4 480.2 99.62 429.3C112.6 418.5 122.1 403.7 126 386.5C164.2 433.8 222.6 464 288 464C402.9 464 496 370.9 496 256C496 141.1 402.9 48 288 48L288 48zM35.66 299.4C37.84 296.3 39.86 293.6 41.6 291.3C44.8 286.9 51.2 286.9 54.4 291.3C67.57 308.6 96 349 96 369C96 383.2 89.58 395.9 79.45 404.5C71.02 411.7 60.02 416 48 416C21.54 416 0 395 0 369C0 351.7 21.44 319.1 35.66 299.4H35.66zM360.4 409.5C350.7 418.6 335.5 418.1 326.5 408.4C319.1 400.5 306.4 392 288 392C269.6 392 256.9 400.5 249.5 408.4C240.5 418.1 225.3 418.6 215.6 409.5C205.9 400.5 205.4 385.3 214.5 375.6C228.7 360.3 253.4 344 288 344C322.6 344 347.3 360.3 361.5 375.6C370.6 385.3 370.1 400.5 360.4 409.5zM367.6 304C349.1 304 335.6 289.7 335.6 272C335.6 254.3 349.1 240 367.6 240C385.3 240 399.6 254.3 399.6 272C399.6 289.7 385.3 304 367.6 304zM207.6 240C225.3 240 239.6 254.3 239.6 272C239.6 289.7 225.3 304 207.6 304C189.1 304 175.6 289.7 175.6 272C175.6 254.3 189.1 240 207.6 240zM219.9 178.7C196.4 202.3 166 217.9 133.1 223.4L130.6 223.8C121.9 225.2 113.7 219.3 112.2 210.6C110.8 201.9 116.7 193.7 125.4 192.2L127.9 191.8C154.2 187.4 178.5 174.9 197.3 156.1L204.7 148.7C210.9 142.4 221.1 142.4 227.3 148.7C233.6 154.9 233.6 165.1 227.3 171.3L219.9 178.7zM371.3 148.7L378.7 156.1C397.5 174.9 421.8 187.4 448.2 191.8L450.6 192.2C459.3 193.7 465.2 201.9 463.8 210.6C462.3 219.3 454.1 225.2 445.4 223.8L442.9 223.4C409.1 217.9 379.6 202.3 356.1 178.7L348.7 171.3C342.4 165.1 342.4 154.9 348.7 148.7C354.9 142.4 365.1 142.4 371.3 148.7z";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("match-history", {
          withCredentials: true,
        });
        const totalMatchHistory = response.data;
        let sortedMatchHistory: any[] = [];
        for (const match of totalMatchHistory) {
          if (
            (match.p1 && match.p1.id === userData.id) ||
            (match.p2 && match.p2.id === userData.id)
          ) {
            sortedMatchHistory.push(match);
          }
        }
        setUserMatchHistory([...sortedMatchHistory].reverse());
        setIsRender(true);
      } catch (error) {
        console.log("error fetching match-history", error);
      }
    };
    fetchData();
  }, [userData]);

  return (
    <>
      {isRender && (
        <>
          {userMatchHistory.length > 0 ? (
            <div className="w-full flex flex-col">
              {userMatchHistory.map((match: any, i) => {
                const isWinner = userData.id === match?.winner_uid;
                const gameDate = formatDate(
                  new Date(match.date_of_creation),
                  2,
                );

                const opponentUsername =
                  userData.id === match?.p1?.id
                    ? match?.p2?.username
                    : match?.p1?.username;
                const playerScore =
                  userData.id === match?.p1?.id
                    ? match?.p1_score
                    : match?.p2_score;
                const playerSmash =
                  userData.id === match?.p1?.id
                    ? match?.p1_smashes
                    : match?.p2_smashes;
                const opponentScore =
                  userData.id === match?.p1?.id
                    ? match?.p2_score
                    : match?.p1_score;
                const opponentSmash =
                  userData.id === match?.p1?.id
                    ? match?.p2_smashes
                    : match?.p1_smashes;

                return (
                  <div
                    key={i}
                    className={`flex h-20 items-center ${
                      i % 2 === 0 ? "rounded-2xl bg-jetblack" : ""
                    }`}
                  >
                    <div className="w-6 h-full flex justify-start items-center">
                      <div
                        className={`w-2 h-6 ${
                          isWinner ? "bg-green" : "bg-tomato"
                        }`}
                      />
                    </div>
                    <p className="flex flex-1 text-timberwolf text-left">
                      {opponentUsername}
                    </p>
                    <p className="w-24 text-dimgrey text-sm text-center">
                      {gameDate}
                    </p>
                    <div
                      className={`flex justify-center items-center ${
                        ((mode === 0 || mode === 1) && "w-60") ||
                        (mode === 2 && "w-64") ||
                        (mode >= 3 && "w-72")
                      }`}
                    >
                      <p className="text-3xl font-bold">{opponentScore}</p>
                      <div
                        className={`hidden md:flex flex-col ${
                          opponentScore < 10 ? "ml-5" : "ml-2"
                        }`}
                      >
                        <p className="text-dimgrey text-xs">smashes</p>
                        <p className="text-timberwolf text-right">
                          {opponentSmash}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`flex justify-center items-center ${
                        ((mode === 0 || mode === 1) && "w-60") ||
                        (mode === 2 && "w-64") ||
                        (mode >= 3 && "w-72")
                      }`}
                    >
                      <div
                        className={`hidden md:flex flex-col ${
                          playerScore < 10 ? "mr-4" : "mr-1"
                        }`}
                      >
                        <p className="text-dimgrey text-xs">smashes</p>
                        <p className="text-timberwolf text-left">
                          {playerSmash}
                        </p>
                      </div>
                      <p className="text-3xl font-bold">{playerScore}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full h-full bg-jetblack rounded-2xl flex flex-col space-y-1 items-center justify-center">
              <svg
                className="w-8 h-8 fill-dimgrey"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
              >
                <path d={oopsPath} />
              </svg>
              <p className="text-dimgrey text-xs">No Match History!</p>
            </div>
          )}
        </>
      )}
    </>
  );
};

const MatchHistoryTitle = ({ mode }: { mode: number }) => {
  return (
    <div className="flex w-full pt-1 pb-2 pl-6">
      <p className="flex flex-1 text-dimgrey text-sm text-left">name</p>
      <p className="w-24 text-dimgrey text-sm text-center">date</p>
      <p
        className={`text-dimgrey text-sm text-center ${
          ((mode === 0 || mode === 1) && "w-60") ||
          (mode === 2 && "w-64") ||
          (mode >= 3 && "w-72")
        }`}
      >
        enemy stats
      </p>
      <p
        className={`text-dimgrey text-sm text-center ${
          ((mode === 0 || mode === 1) && "w-60") ||
          (mode === 2 && "w-64") ||
          (mode >= 3 && "w-72")
        }`}
      >
        your stats
      </p>
    </div>
  );
};

const UserMatchHistory = ({ mode }: { mode: number }) => {
  return (
    <div className="flex flex-col w-full h-full no-scrollbar">
      <MatchHistoryTitle mode={mode} />
      <div className="flex flex-col flex-1 w-full h-full rounded-3xl overflow-y-scroll no-scrollbar">
        <MatchHistory mode={mode} />
      </div>
    </div>
  );
};

export default UserMatchHistory;
