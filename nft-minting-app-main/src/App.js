import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

const truncate = (input, len) =>
    input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 15px;
  border-radius: 18px;
  border: none;
  background-color: #0000ff;
  padding: 15px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: #0000ff;
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: #fff;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 500px;
  @media (min-width: 767px) {
    width: 500px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`

  border-radius: 100px;
  border: 10px 	#000000 solid;
  
  width: 250px;
  @media (min-width: 900px) {
    width: 100%;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  @media (min-width: 1440px) {
    width: 500px;
  }
`;

export const StyledTeamImg = styled.img`

  border-radius: 8px;
  border: 6px #ffffff solid;
  width: 200px;
  @media (min-width: 900px) {
    width: 350px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
`;

export const StyledHeader = styled.img`
  width: 45vw;
`;

export const StyledLink = styled.a`
  color: var(--primary-text);
  text-decoration: none;
`;


function App() {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    //Contract Data
    const data = useSelector((state) => state.data);
    const [claimingNft, setClaimingNft] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [mintAmount, setMintAmount] = useState(1);
    const [freeMintAmount, setFreeMintAmount] = useState(1);
    const [CONFIG, SET_CONFIG] = useState({
        CONTRACT_ADDRESS: "",
        SCAN_LINK: "",
        NETWORK: {
            NAME: "",
            SYMBOL: "",
            ID: 0,
        },
        NFT_NAME: "",
        SYMBOL: "",
        MAX_SUPPLY: 1,
        WEI_COST: 0,
        DISPLAY_COST: 0,
        GAS_LIMIT: 0,
        MARKETPLACE: "",
        MARKETPLACE_LINK: "",
        SHOW_BACKGROUND: false,
    });

    const claimNFTs = () => {
        let cost = CONFIG.WEI_COST;
        let gasLimit = CONFIG.GAS_LIMIT;
        let totalCostWei = String(cost * mintAmount);
        gasLimit = (132705 + 3508 * (mintAmount - 1)) / mintAmount;

        //FREE Mint Cost
        /*if (mintAmount <= 2) {
            totalCostWei = String(0);
            gasLimit = (132705 + 3508 * (mintAmount - 1)) / mintAmount;
        } else {
            totalCostWei = String(cost * (mintAmount - 2));
            gasLimit = (132705 + 3508 * (mintAmount - 1)) / mintAmount;
        }*/


        /*//FREE Mint Cost
        if ((data.totalSupply) < 5555) {
            totalCostWei = String(0);
            gasLimit = (132705 + 3508 * (mintAmount - 1)) / mintAmount;
        } else {
            totalCostWei = String(cost * mintAmount);
            gasLimit = (132705 + 3508 * (mintAmount - 1)) / mintAmount;
        }*/

        let totalGasLimit = String(gasLimit * mintAmount);
        console.log("Cost: ", totalCostWei);
        console.log("Gas limit: ", totalGasLimit);
        setFeedback(`Enjoy your ${CONFIG.NFT_NAME}...`);
        setClaimingNft(true);
        blockchain.smartContract.methods
            .mint(mintAmount)
            .send({
                gasLimit: String(totalGasLimit),
                to: CONFIG.CONTRACT_ADDRESS,
                from: blockchain.account,
                value: totalCostWei,

            })
            .once("error", (err) => {
                console.log(err);
                setFeedback("Sorry, something went wrong please try again later.");
                setClaimingNft(false);
            })
            .then((receipt) => {
                console.log(receipt);
                setFeedback(
                    `Enter The ${CONFIG.NFT_NAME}.`
                );
                setClaimingNft(false);
                dispatch(fetchData(blockchain.account));
            });
    };

    const claimFreeNFTs = () => {
        //let cost = CONFIG.WEI_COST;
        let gasLimit = CONFIG.GAS_LIMIT;
        let totalCostWei = String(0);

        //FREE Mint Cost
        gasLimit = (132705 + 3508 * (freeMintAmount - 1)) / freeMintAmount;

        let totalGasLimit = String(gasLimit * freeMintAmount);
        console.log("Cost: ", totalCostWei);
        console.log("Gas limit: ", totalGasLimit);
        setFeedback(`Enjoy your ${CONFIG.NFT_NAME}...`);
        setClaimingNft(true);
        blockchain.smartContract.methods
            .mint(freeMintAmount)
            .send({
                gasLimit: String(totalGasLimit),
                to: CONFIG.CONTRACT_ADDRESS,
                from: blockchain.account,
                value: totalCostWei,

            })
            .once("error", (err) => {
                console.log(err);
                setFeedback("Sorry, something went wrong please try again later.");
                setClaimingNft(false);
            })
            .then((receipt) => {
                console.log(receipt);
                setFeedback(
                    `Enter The ${CONFIG.NFT_NAME}.`
                );
                setClaimingNft(false);
                dispatch(fetchData(blockchain.account));
            });
    };

    const decrementMintAmount = () => {
        let newMintAmount = mintAmount - 1;
        if (newMintAmount < 1) {
            newMintAmount = 1;
        }
        setMintAmount(newMintAmount);
    };

    const incrementMintAmount = () => {
        let newMintAmount = mintAmount + 1;
        if (newMintAmount > 5) {
            newMintAmount = 5;
        }
        setMintAmount(newMintAmount);
    };

    const getData = () => {
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
            dispatch(fetchData(blockchain.account));
        }
    };

    const getConfig = async () => {
        const configResponse = await fetch("/config/config.json", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        const config = await configResponse.json();
        SET_CONFIG(config);
    };

    useEffect(() => {
        getConfig();
    }, []);

    useEffect(() => {
        getData();
    }, [blockchain.account]);

    //You have minted {data.mintedCount(blockchain.account)}

    //
    //<img alt="logo" src="/config/images/logo.png">
    //<StyledImg alt={"example"} src={"/config/images/example.gif"} /> LINE 310

    return (
        <s.Screen>
            <s.Container
                flex={1}
                ai={"center"}
                style={{ backgroundColor: "var(--primary)" }}

                image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.jpg" : null}



            >
                <s.TextTitle
                    style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                        fontFamily: "comic sans ms",
                        fontWeight: "bold",
                        //textShadow: "2px 2px blue",
                    }}
                >

                    <br />
                    <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />
                    <br />


                </s.TextTitle>


                <ResponsiveWrapper flex={1} style={{ padding: 25 }} test>
                    <s.Container flex={1} jc={"center"} ai={"center"}>

                    </s.Container>
                    <s.SpacerLarge />
                    <s.Container

                        flex={1}
                        jc={"center"}
                        ai={"center"}
                        style={{
                            backgroundColor: "(255,255,255)",
                            padding: 10,
                            borderRadius: 90,
                            border: "0px solid var(--secondary)",
                            boxShadow: "10px 10px 100px 10px rgba	(255,255,255)",
                        }}
                    >
                        <s.TextTitle

                            style={{
                                textAlign: "center",
                                fontSize: 40,
                                fontWeight: "bold",
                                color: "var(--accent-text)",
                                fontFamily: "comic sans ms",

                            }}
                        >

                            <br />
                            {data.totalSupply} / {CONFIG.MAX_SUPPLY}<br />
                            <br />

                        </s.TextTitle>
                        <s.TextDescription

                            style={{
                                textAlign: "center",
                                color: "white",
                                fontWeight: "bold",
                                fontFamily: "comic sans ms",
                                fontSize: "14px"

                            }}
                        >
                            <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
                            </StyledLink>
                        </s.TextDescription>
                        <s.SpacerSmall />
                        {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                            <>
                                <s.TextTitle

                                    style={{
                                        textAlign: "center",
                                        color: "white",
                                        fontFamily: "comic sans ms",
                                    }}
                                >
                                    The sale has ended.

                                </s.TextTitle>
                                <s.TextDescription

                                    style={{
                                        textAlign: "center",
                                        color: "var(--accent-text)",
                                        fontFamily: "comic sans ms",
                                    }}
                                >
                                    You can still find {CONFIG.NFT_NAME} on opensea

                                </s.TextDescription>
                                <s.SpacerSmall />
                                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                                    {CONFIG.MARKETPLACE}
                                </StyledLink>
                            </>
                        ) : (
                            <>
                                <s.TextTitle
                                    style={{
                                        textAlign: "center",
                                        color: "var(--accent-text)",
                                        fontFamily: "comic sans ms",
                                        fontWeight: "bold",
                                        //textShadow: "2px 2px blue",
                                    }}
                                >

                                    <br />





                                </s.TextTitle>
                                <s.SpacerXSmall />
                                <s.TextDescription
                                    style={{
                                        textAlign: "center",
                                        color: "var(--accent-text)",
                                        fontFamily: "comic sans ms",
                                    }}
                                >


                                </s.TextDescription>
                                <s.SpacerSmall />
                                {blockchain.account === "" ||
                                    blockchain.smartContract === null ? (
                                    <s.Container ai={"center"} jc={"center"}>
                                        <s.TextDescription

                                            style={{
                                                textAlign: "center",
                                                color: "var(--accent-text)",
                                                fontFamily: "comic sans ms",
                                            }}
                                        >


                                        </s.TextDescription>
                                        <s.SpacerSmall />
                                        <StyledButton
                                            onClick={(e) => {
                                                e.preventDefault();
                                                dispatch(connect());
                                                getData();
                                            }}
                                        > Connect
                                            <br />



                                        </StyledButton>
                                        {blockchain.errorMsg !== "" ? (
                                            <>
                                                <s.SpacerSmall />
                                                <s.TextDescription

                                                    style={{
                                                        textAlign: "center",
                                                        color: "var(--accent-text)",
                                                        fontFamily: "comic sans ms",
                                                    }}
                                                >
                                                    {blockchain.errorMsg}
                                                </s.TextDescription>
                                            </>
                                        ) : null}
                                    </s.Container>
                                ) : (
                                    <>

                                        <s.TextDescription

                                            style={{
                                                textAlign: "center",
                                                color: "var(--accent-text)",
                                                fontFamily: "comic sans ms",
                                            }}
                                        >
                                            {feedback}
                                        </s.TextDescription>
                                        <s.SpacerMedium />
                                        <s.Container ai={"center"} jc={"center"} fd={"row"}>
                                            <StyledRoundButton

                                                style={{ lineHeight: 0.4 }}
                                                disabled={claimingNft ? 1 : 0}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    decrementMintAmount();
                                                }}
                                            >
                                                -
                                            </StyledRoundButton>
                                            <s.SpacerMedium />
                                            <s.TextDescription

                                                style={{
                                                    textAlign: "center",
                                                    color: "var(--accent-text)",
                                                    fontFamily: "comic sans ms",
                                                }}
                                            >

                                                {mintAmount}
                                            </s.TextDescription>
                                            <s.SpacerMedium />
                                            <StyledRoundButton
                                                disabled={claimingNft ? 1 : 0}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    incrementMintAmount();
                                                }}
                                            >
                                                +
                                            </StyledRoundButton>
                                        </s.Container>
                                        <s.SpacerSmall />
                                        <s.Container ai={"center"} jc={"center"} fd={"row"}>
                                            <StyledButton
                                                disabled={claimingNft ? 1 : 0}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    claimNFTs();
                                                    getData();
                                                }}
                                            >
                                                {claimingNft ? "PROCESSING" : "PAID MINT"}
                                            </StyledButton>
                                        </s.Container>

                                        <s.SpacerSmall />
                                        <s.TextDescription

                                            style={{
                                                textAlign: "center",
                                                color: "white",
                                                fontFamily: "Comic sans MS",
                                                fontSize: "18px",
                                                fontWeight: "900",

                                            }}

                                        >

                                            1 Free Mint after first 1000 minted

                                        </s.TextDescription>
                                        <s.SpacerSmall />

                                        <s.Container ai={"center"} jc={"center"} fd={"row"}>
                                            <StyledButton
                                                disabled={claimingNft ? 1 : 0}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setFreeMintAmount(1);
                                                    claimFreeNFTs();
                                                    getData();
                                                }}
                                            >
                                                {claimingNft ? "PROCESSING" : "1 FREE MINT"}
                                            </StyledButton>
                                        </s.Container>

                                        <s.SpacerSmall />
                                        <s.TextDescription

                                            style={{
                                                textAlign: "center",
                                                color: "white",
                                                fontFamily: "Comic sans MS",
                                                fontSize: "18px",
                                                fontWeight: "900",

                                            }}

                                        >

                                            2 Free Mints before 1000 minted

                                        </s.TextDescription>
                                        <s.SpacerSmall />

                                        <s.Container ai={"center"} jc={"center"} fd={"row"}>
                                            <StyledButton
                                                disabled={claimingNft ? 1 : 0}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setFreeMintAmount(2);
                                                    claimFreeNFTs();
                                                    getData();
                                                }}
                                            >
                                                {claimingNft ? "PROCESSING" : "2 FREE MINT"}
                                            </StyledButton>
                                        </s.Container>

                                    </>
                                )}
                            </>
                        )}
                        <s.SpacerMedium />
                    </s.Container>
                    <s.SpacerLarge />
                    <s.Container flex={1} jc={"center"} ai={"center"}>

                    </s.Container>
                </ResponsiveWrapper>
                <s.SpacerMedium />
                <s.Container jc={"center"} ai={"left"} style={{ width: "90%" }}>



                    <s.TextDescription

                        style={{
                            textAlign: "center",
                            color: "white",
                            fontFamily: "Comic sans MS",
                            fontSize: "24px",
                            fontWeight: "900",

                        }}

                    >

                        <h2>FAQ</h2><br />
                        <br />
                        Q. How much is mint?<br />
                        A. You can mint 2 free gozukis during the first 1000 mints, and 1 free gozuki after that.<br />
                        You can also mint extras at any time for 0.005 each.<br />
                        <br />
                        Q. When will Gozuki reveal?<br />
                        A. Gozuki will reveal instantly.<br />
                        <br />
                        Q. Where can I find the Gozuki Twitter?<br />
                        A. You can find our <a href="https://www.twitter.com/GozukiOfficial">Twitter here</a>.<br />
                        <br />


                    </s.TextDescription>
                    <s.SpacerSmall />

                    <s.TextDescription

                        style={{
                            textAlign: "center",
                            color: "white",
                            fontFamily: "Comic sans MS",
                            fontSize: "28px",
                            fontWeight: "bold",

                        }}

                    >


                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />


                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container>
                    </s.Container>
                    <s.TextDescription



                    >






                    </s.TextDescription>
                </s.Container>
            </s.Container >
        </s.Screen >
    );
}

export default App;