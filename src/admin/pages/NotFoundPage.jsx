/**
 * 404 Not Found Page
 */

import React from 'react';
import { __ } from '@wordpress/i18n';
import {
  Card,
  CardBody,
  Button,
  __experimentalHeading as Heading,
  __experimentalText as Text,
  __experimentalVStack as VStack,
} from '@wordpress/components';

const NotFoundPage = ({ navigate }) => {

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '400px' 
    }}>
      <Card style={{ maxWidth: '500px', textAlign: 'center' }}>
        <CardBody>
          <VStack spacing={4}>
            <div style={{ fontSize: '72px', color: '#646970' }}>
              404
            </div>
            
            <Heading level={1} style={{ fontSize: '24px', margin: 0 }}>
              {__('Page Not Found', 'lean-forms')}
            </Heading>
            
            <Text style={{ color: '#646970', fontSize: '16px' }}>
              {__('The page you\'re looking for doesn\'t exist or has been moved.', 'lean-forms')}
            </Text>
            
            <Button 
              variant="primary" 
              onClick={() => navigate('dashboard')}
            >
              {__('Go to Dashboard', 'lean-forms')}
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </div>
  );
};

export default NotFoundPage;
