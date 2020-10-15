import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 0;
  margin: auto;
  max-width: 100vw;
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
  background: #0f141e;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;

  background-color: black;
  opacity: ${({ isVisible }) => isVisible ? '1' : '0'};
  transition: opacity 0.2s ease-in-out;
  will-change: opacity;
`;

class SceneRouter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewImage: null,
    };
  }

  async getPreviewImage() {
    try {
      const remoteUrl = `${this.instantRemixing.get(['serviceMap', 'backend'])}/preview`;
      const request = await fetch(remoteUrl);
      const image = await request.blob();
      const url = URL.createObjectURL(image);
      this.setState({ previewImage: url });
    } catch (err) {
      //
    }
  }

  componentDidMount() {
    // Load the preview image from the backend
    this.getPreviewImage();
  }

  render() {
    const {
      previewImage,
    } = this.state;

    return (
      <Container>
        <Image src={previewImage} />
      </Container>
    );
  }
}

export default SceneRouter;
