import React from 'react';
import { Home } from '../../pages/home';

interface ContainerProps {}

export const ExploreContainer: React.FC<ContainerProps> = () => {
  return (
    <div>
      <strong>Ready to create an app?</strong>
      <p>
        Start with Ionic&nbsp;
        <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">
          UI Components
        </a>
        <Home />
      </p>
    </div>
  );
};
