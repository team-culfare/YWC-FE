import React from "react";
import styled from "styled-components";

const Advertisement = () => {
    return <Container>Ad Section</Container>;
};

const Container = styled.div`
    width: calc(100% + 40px);
    height: 100px;
    background-color: ${({ theme }) => theme.colors.pageBtn};
    opacity: 0.1;
`;

export default Advertisement;
