import React from "react";
import styled from "styled-components";
import { ReactComponent as ArrowLeft } from "@assets/icons/arrow-left.svg";
import { ReactComponent as ArrowRight } from "@assets/icons/arrow-right.svg";
import usePagination from "@hooks/usePagination";
import { useNavigate, useSearchParams } from "react-router-dom";

type PaginationPropsType = {
    total: number;
    limit: number;
    maxPage: number;
};

type PageButtonPropsType = {
    activated?: boolean;
};

const Pagination = ({ total, limit, maxPage }: PaginationPropsType) => {
    if (total < limit) return <></>;
    const [searchParams] = useSearchParams();
    const [query, page, city] = [
        searchParams.get("q"),
        searchParams.get("page"),
        searchParams.get("city"),
    ];
    const nav = useNavigate();
    const { prevPage, nextPage, pageRange, totalPages } = usePagination(
        total,
        limit,
        maxPage,
        Number(page),
    );

    const pageHandler = (page: number | null) => {
        page !== null &&
        // setParams({
        //     q: String(params.get("q")),
        //     page: String(page),
        //     city: params.get("city") || "",
        // });
        city
            ? nav(`?q=${query}&page=${page}&city=${city}`)
            : nav(`?q=${query}&page=${page}`);
    };

    return (
        <Container>
            <PageButton
                style={{ width: "50px" }}
                onClick={() => {
                    pageHandler(prevPage());
                }}
            >
                <ArrowLeft width="20" fill="#93A8BB" />
            </PageButton>
            {pageRange
                .filter((c) => c <= totalPages)
                .map((i) => {
                    return (
                        <PageButton
                            onClick={() => pageHandler(i)}
                            key={i}
                            activated={Number(page) === i}
                        >
                            {i}
                        </PageButton>
                    );
                })}
            <PageButton
                style={{ width: "50px" }}
                onClick={() => {
                    pageHandler(nextPage());
                }}
            >
                <ArrowRight width="20" fill="#93A8BB" />
            </PageButton>
        </Container>
    );
};

const Container = styled.nav`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 5px;
    width: 100%;
    min-height: 100px;
    padding: 10px 20px;
    padding-bottom: 70px;
`;

const PageButton = styled.button<PageButtonPropsType>`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    background-color: transparent;
    border: none;
    outline: none;
    font-size: ${({ theme }) => theme.sizes.m};
    font-weight: 700;
    color: ${({ theme }) => theme.colors.pageBtn};
    ${({ activated, theme }) =>
        activated &&
        `background-color: ${theme.colors.pageBtnActive}; border-radius: 10px; color: white;`};
`;

export default Pagination;
