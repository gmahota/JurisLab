import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            <span className="block">JurisLab</span>
            <span className="block text-indigo-600 dark:text-indigo-400">Legal Intelligence Platform</span>
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            Powerful AI-enhanced tools for judicial decisions and labor contracts analysis.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Judicial Decisions
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                Browse, search, and analyze judicial decisions with AI-powered insights.
              </p>
              <div className="mt-4">
                <Link href="/judicial-decisions">
                  <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                    Explore Decisions
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Labor Contracts
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                Access, download, and gain insights from labor contracts across industries.
              </p>
              <div className="mt-4">
                <Link href="/labor-contracts">
                  <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                    Browse Contracts
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-indigo-50 dark:bg-gray-700 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                AI Insights
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                Discover trends, patterns, and insights powered by our AI analysis of legal documents.
              </p>
              <div className="mt-4">
                <Link href="/ai-insights">
                  <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                    View Insights
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/dashboard">
            <span className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
              Go to Dashboard
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}