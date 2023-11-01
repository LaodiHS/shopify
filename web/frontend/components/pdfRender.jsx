// import React from 'react';
// import { Page, Text, View, Image, Document, StyleSheet } from '@react-pdf/renderer';
// import styled from 'styled-components';

// // Define reusable styles using styled-components
// const Heading1 = styled.Text`
//   font-size: 24px;
//   line-height: 1.5;
// `;

// const Heading2 = styled.Text`
//   font-size: 20px;
//   line-height: 1.4;
// `;

// const Paragraph = styled.Text`
//   font-size: 16px;
//   line-height: 1.6;
// `;

// // Styling for the PDF document using react-pdf's StyleSheet.create
// const styles = StyleSheet.create({
//   page: {
//     flexDirection: 'column',
//     padding: '20px', // Use relative units for padding
//   },
//   image: {
//     width: '100%', // Use relative units for image size
//     height: 'auto', // Height will scale proportionally based on width
//   },
// });

// // Your PDF document component
// const MyPDFDocument = () => {
//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         <View>
//           <Heading1>Heading 1 Text</Heading1>
//           <Heading2>Heading 2 Text</Heading2>
//           <Paragraph>This is a paragraph.</Paragraph>
//         </View>
//         <View>
//           {/* Adjust image path and alt text accordingly */}
//           <Image style={styles.image} src="path/to/image.jpg" alt="Image" />
//         </View>
//       </Page>
//     </Document>
//   );
// };

// export default MyPDFDocument;