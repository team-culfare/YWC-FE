import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Container as MapDiv } from "react-naver-maps";
import { MapContainer } from "@components/Map";
import { Loading } from "@components/core";
import { getStoreListByCoords } from "@apis/store";
import { IStores } from "@_types/store";
import { coordType } from "@_types/coord";
import getZoomDistance from "@utils/zoomDistance";
import { useNavigate } from "react-router-dom";

type coordListType = {
    coord: coordType;
    clientCoord: coordType;
    temp: coordType;
};

const Map = () => {
    const [coordList, setCoordList] = useState<coordListType>({
        coord: { result: null, lat: 0, lng: 0 },
        clientCoord: { result: null, lat: 0, lng: 0 },
        temp: { result: null, lat: 0, lng: 0 },
    });
    const [loading, setLoading] = useState(false);
    const [storeList, setStoreList] = useState<IStores>([]);
    const [distance, setDistance] = useState(300);
    const [isChanged, setIsChanged] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        setLoading(true);
        if (window.navigator.geolocation) {
            alert(
                "지도 사용을 위해선 위치 수집 권한이 필요합니다. 다음에 표시되는 위치 권한 알림창에 [허용]을 눌러주세요!",
            );
            window.navigator.geolocation.getCurrentPosition(
                (c) => {
                    setCoordList({
                        ...coordList,
                        coord: {
                            result: "success",
                            lat: c.coords.latitude,
                            lng: c.coords.longitude,
                        },
                        clientCoord: {
                            result: "success",
                            lat: c.coords.latitude,
                            lng: c.coords.longitude,
                        },
                    });
                    setLoading(false);
                },
                () => {
                    console.log("Error");
                    setCoordList({
                        ...coordList,
                        coord: { result: "error", lat: -1, lng: -1 },
                    });
                    alert(
                        "위치를 받아오는 데 오류가 발생하였습니다. 위치 권한을 다시 확인 해 주세요.",
                    );
                    nav("/");
                },
            );
        } else {
            alert(
                "Geolocation API가 지원되지 않는 브라우저 입니다. 새로운 버전의 브라우저로 재접속 해주세요.",
            );
        }
    }, []);

    useEffect(() => {
        if (coordList.coord.lat <= 0 || coordList.coord.lng <= 0) return;
        getStoreListByCoords(coordList.coord.lat, coordList.coord.lng, distance)
            .then((res) => {
                if (res.code === 2000) {
                    setStoreList(res.result.rows);
                }
            })
            .catch((e) => console.log(e));
    }, [coordList.coord]);

    useEffect(() => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);

        window.addEventListener("resize", () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty("--vh", `${vh}px`);
        });
    });

    const refreshHandler = () => {
        setCoordList({ ...coordList, coord: coordList.temp });
        setIsChanged(false);
    };

    const centerChangeHandler = (e: naver.maps.Coord) => {
        if (e.y !== coordList.coord.lat && e.x !== coordList.coord.lng) {
            setIsChanged(true);
            setCoordList({
                ...coordList,
                temp: { result: "success", lat: e.y, lng: e.x },
            });
        }
    };

    if (loading) return <Loading />;
    return (
        <>
            <Container>
                <MapDiv
                    style={{
                        width: "100%",
                        height: "calc(var(--vh, 1vh) * 100)",
                    }}
                    fallback={<Loading />}
                >
                    <MapContainer
                        clientCoord={{
                            lat: coordList.clientCoord.lat,
                            lng: coordList.clientCoord.lng,
                        }}
                        coord={{
                            lat: coordList.coord.lat,
                            lng: coordList.coord.lng,
                        }}
                        markers={storeList}
                        onCenterChanged={(e: naver.maps.Coord) =>
                            centerChangeHandler(e)
                        }
                        onZoomChanged={(e: number) =>
                            setDistance(getZoomDistance(e))
                        }
                        refreshHandler={refreshHandler}
                        coordList={coordList}
                        setCoordList={setCoordList}
                        isChanged={isChanged}
                    />
                </MapDiv>
            </Container>
        </>
    );
};

const Container = styled.div`
    position: relative;
    width: min(480px, 100%);
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
    margin: 0 auto;
    background-color: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.black}
    font-size: ${({ theme }) => theme.sizes.l};
    z-index: 9999;
    overflow: hidden;
`;

export default Map;
