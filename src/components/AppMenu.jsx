// src/components/AppMenu.js
import React, {useState, useEffect} from 'react';
import {Command} from "@tauri-apps/api/shell";
import { listen } from '@tauri-apps/api/event';

const AppMenu = () => {
    const [output, setOutput] = useState();
    const [command, setCommand] = useState('');

    const runDirectoryCommand = async() => {
        const output = await new Command('mkdir').execute();
        setOutput(output);
    }

    
    const runEchoCommand = async() => {
        const output = await new Command('echo').execute();
        setOutput(output);
    }
    
    const runLsCommand = async() => {
        const output = await new Command('ls -lah').execute();
        setOutput(output);
    }

    const renderOutputLines = (output) => {

        return output && output.split('\n').map((line, index) => (

            <div key={index} className='whitespace-pre-wrap'>{line}</div>

        ));
    };

    useEffect(() => {

      listen('systemTray', ({ payload }) => {

        console.log(payload.message);

        setCommand(payload.message)
      })

      switch (command) {
        case "mkdir":
            runDirectoryCommand();
            break;
        case "echo":
            runEchoCommand();
            break;
        case "ls -lah":
            runLsCommand();
            break;

        default:
            break;
    }

    }, [command]);

    return (
        <>
                <div className="px-4 sm:px-6 lg:px-8">
                    <p className='my-6 font-semibold text-lg'>{`Selected command :--> ${command}`}</p>
                    <div className="bg-whit mt-5 shadow sm:rounded-lg max-w-[800px] py-10 px-5" style={{border:'1px solid gray'}}>
                        {output &&
                        <>
                            <p className='my-2'>{`Command Output :--> `}</p>
                            <p className='my-2 font-mono bg-black text-white p-6'>
                                {renderOutputLines(output.stdout)}
                            </p>
                        </>

                        }

                        {output && <p className='my-2'>
                            {`Execution status :--> ${ !output.code ? 'Succeed': 'Failed'}`}
                        </p>
                        }

                        {output && <p className='my-2'>
                            {`Command Error :--> ${ output.stderr}`}
                        </p>
                        }
                    </div>
                </div>
        </>
    )

};

export default AppMenu;
