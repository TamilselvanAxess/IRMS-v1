import React from 'react';
import { ComponentShowcase, ToastDemo, ToastTest } from '../components/common';
import ApiTest from '../components/common/ApiTest';

const Demo = () => {
  return (
    <div className="space-y-8">
      <ComponentShowcase />
      <ToastTest />
      <ToastDemo />
      <ApiTest />
    </div>
  );
};

export default Demo; 