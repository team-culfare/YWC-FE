import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import SearchInput from "../../components/SearchInput";
import SearchButton from "../../components/SearchButton";
import ListView from "../../components/ListView";
import ListItem from "../../components/ListView/ListItem";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import InformationBox from "../../components/InformationBox";
import { getStoreList } from "../../apis/store";
import { IStores } from "../../types/store";
import QueryString from "qs";

const index = () => {
    const [params, setParams] = useSearchParams();
    const [storeList, setStoreList] = useState<IStores>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>(0);
    const [value, setValue] = useState<string>("");

    const currentPage = params.get("page");
    const searchQuery = params.get("q");

    const searchHandler = (value: string) => {
        setParams(
            { q: value, page: "1" },
            { replace: true, preventScrollReset: false },
        );
    };

    useEffect(() => {
        if (currentPage && searchQuery) {
            setLoading(true);
            getStoreList(searchQuery, currentPage)
                .then((res) => {
                    if (res.code === 2000) {
                        setStoreList(res.result.rows);
                        setCount(res.result.count);
                        setLoading(false);
                    } else {
                        setLoading(false);
                        console.error("An error occurred while fetching data.");
                        console.error("Error Code: ", res.code);
                        console.error("Error Message: ", res.message);
                    }
                })
                .catch((e) => console.log(e));
        }
    }, [searchQuery, currentPage]);

    useEffect(() => {
        if (searchQuery) {
            const query = QueryString.parse(location.search, {
                ignoreQueryPrefix: true,
            });
            setParams(
                { ...query, page: "1" },
                { replace: true, preventScrollReset: false },
            );
        } else {
            setCount(0);
            setStoreList([]);
        }
    }, [searchQuery]);

    return (
        <>
            <SearchContainer>
                <SearchInput
                    onChange={(e) => setValue(e.target.value)}
                    onKeyPress={(e) =>
                        e.key === "Enter" && value && searchHandler(value)
                    }
                    defaultValue={searchQuery ? searchQuery : ``}
                />
                <SearchButton onClick={() => value && searchHandler(value)} />
            </SearchContainer>
            {!currentPage || !searchQuery ? (
                <InformationBox />
            ) : loading ? (
                <Loading />
            ) : count > 0 ? (
                <>
                    <ListViewContainer>
                        <SearchCount>{count}개의 검색결과</SearchCount>
                        <ListView>
                            {storeList.map((e) => {
                                return (
                                    <ListItem
                                        key={e._id}
                                        _id={e._id}
                                        name={e.name}
                                        category={e.category}
                                        address={e.address}
                                        phone={e.phone}
                                    />
                                );
                            })}
                        </ListView>
                    </ListViewContainer>
                </>
            ) : (
                <NoResultContainer>검색 결과가 없습니다.</NoResultContainer>
            )}
            {count > 15 && <Pagination total={count} limit={15} maxPage={5} />}
        </>
    );
};

const SearchContainer = styled.section`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 50px;
    background-color: ${({ theme }) => theme.white};
`;

const ListViewContainer = styled.section`
    width: 100%;
    height: auto;
    padding: 14px 20px;
`;

const SearchCount = styled.span`
    display: block;
    width: 100%;
    height: 30px;
    color: ${({ theme }) => theme.pageBtn};
    font-size: ${({ theme }) => theme.m};
    font-weight: 600;
`;

const NoResultContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100px;
    font-weight: 600;
    font-size: ${({ theme }) => theme.l};
    color: ${({ theme }) => theme.pageBtn};
`;

export default index;