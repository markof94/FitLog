import styled from 'styled-components';

const Glow = styled.div`
background: radial-gradient(circle, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0) 50%);
width: 100%;
height: 100%;
position: absolute;
top: 0;
left: 0;
z-index: 1;
`;

export default Glow;
