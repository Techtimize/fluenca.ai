"use client";

import { AnalyzeCompanyMutation } from '@/routes/bussiness/Bussiness-Mutation'
import { AnalyzeCompanyResultsApi } from '@/routes/bussiness/bussiness.routes';
import { useParams } from 'next/navigation';
import React from 'react'

const OverviewPage = () => {
    const { Id } = useParams();
    const { mutate: analyzeCompany } = AnalyzeCompanyMutation();
    // const { data: analyzeCompanyResults } = ();
  return (
    <div>Overview</div>
  )
}

export default OverviewPage