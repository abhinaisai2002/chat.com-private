import { mouseCursorAtom } from '@/atoms/mouseIconAtom'
import NavBar from '@/components/app/ui/NavBar'
import Head from 'next/head'
import React from 'react'
import { RecoilRoot, useRecoilValue } from 'recoil'
import dynamic from 'next/dynamic'
import { DialogDemo } from '@/components/client/TextModal'
import { useRouter } from 'next/router'

const ClientCanvas = dynamic(() => import('../../../components/client/Canvas'), {
    ssr: false,
})


export default function Index() {

    const mouseCursor = useRecoilValue(mouseCursorAtom);

    const params = useRouter();

    React.useEffect(() => {
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey &&
                (
                    e.code === 'Minus' || e.code === 'Equal'
                )
            ) e.preventDefault();

        })

        document.getElementById('__next').addEventListener('wheel', (e) => {
            if (e.ctrlKey) {
                e.preventDefault()
                e.stopImmediatePropagation();
            }

        })


        return () => {
            removeEventListener('keydown', (e) => {
                if (e.ctrlKey &&
                    (
                        e.code === 'Minus' || e.code === 'Equal'
                    )
                ) e.preventDefault();

            });
            document.getElementById('__next').removeEventListener('wheel', (e) => {
                if (e.ctrlKey) {
                    e.preventDefault()
                    e.stopImmediatePropagation();
                }

            })
        }
    }, [])



    return (
        <div className='h-full overflow-hidden'>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover, shrink-to-fit=no" />
                 <title>Chat.com | Board</title>
            </Head>
            <ClientCanvas boardId={params.query.boardId} className={`${mouseCursor}`}></ClientCanvas>

            <div className='absolute top-6 w-full flex justify-center'>
                <NavBar />
            </div>
            <div>
              <DialogDemo />
            </div>


            
        </div >
    )
}


Index.getLayout = function getLayout(page) {
    return (
        <RecoilRoot>{page}</RecoilRoot>
    )
}